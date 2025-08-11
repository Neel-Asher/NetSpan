// UndoRedo.tsx
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Undo, Redo, History, RotateCcw } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  nodeIdCounter: number;
  edgeIdCounter: number;
  timestamp: number;
  action: string;
}

type SaveInput =
  | GraphState
  | Partial<GraphState>
  | ((prev: GraphState) => GraphState | Partial<GraphState>);

interface UndoRedoProps {
  onStateChange: (state: GraphState) => void;
  maxHistorySize?: number;
}

export function useUndoRedo(initialState: GraphState, maxHistorySize: number = 50) {
  const [history, setHistory] = React.useState<GraphState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Refs to avoid stale closures and keep handlers stable
  const historyRef = React.useRef(history);
  const indexRef = React.useRef(currentIndex);
  const initialRef = React.useRef(initialState);

  React.useEffect(() => {
    historyRef.current = history;
  }, [history]);

  React.useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Save with partial/object or function updater
  const saveState = React.useCallback((input: SaveInput, action: string) => {
    setHistory(prevHistory => {
      const idx = indexRef.current;
      const present = prevHistory[idx] ?? initialRef.current;

      const patch = typeof input === 'function' ? input(present) : input;
      const next: GraphState = {
        ...present,
        ...(patch as Partial<GraphState>),
        action,
        timestamp: Date.now(),
      };

      // discard "future" and append next
      const trimmed = prevHistory.slice(0, idx + 1);
      let newHistory = [...trimmed, next];

      // cap history
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      // always point at the new last entry
      setCurrentIndex(Math.min(newHistory.length - 1, maxHistorySize - 1));
      return newHistory;
    });
  }, [maxHistorySize]);

  // Stable handlers: check bounds at call time using refs
  const undo = React.useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const redo = React.useCallback(() => {
    setCurrentIndex(prev => {
      const max = historyRef.current.length - 1;
      return prev < max ? prev + 1 : prev;
    });
  }, []);

  // Stable getter using refs (no re-creation on render)
  const getCurrentState = React.useCallback(() => {
    const h = historyRef.current;
    const i = indexRef.current;
    return h[i] ?? initialRef.current;
  }, []);

  const clearHistory = React.useCallback(() => {
    const present = historyRef.current[indexRef.current] ?? initialRef.current;
    setHistory([present]);
    setCurrentIndex(0);
  }, []);

  const getHistoryInfo = React.useCallback(() => {
    const h = historyRef.current;
    const i = indexRef.current;
    return {
      totalStates: h.length,
      currentIndex: i,
      canUndo: i > 0,
      canRedo: i < h.length - 1,
      recentActions: h.slice(Math.max(0, i - 4), i + 1).reverse(),
    };
  }, []);

  return {
    saveState,
    undo,
    redo,
    getCurrentState,
    clearHistory,
    getHistoryInfo,
    canUndo,
    canRedo,
  };
}

export function UndoRedoControls({ onStateChange, maxHistorySize = 50 }: UndoRedoProps) {
  const initialState = React.useMemo(() => ({
    nodes: [],
    edges: [],
    nodeIdCounter: 0,
    edgeIdCounter: 0,
    timestamp: Date.now(),
    action: 'Initial state',
  }), []);

  const {
    undo,
    redo,
    getCurrentState,
    clearHistory,
    getHistoryInfo,
    canUndo,
    canRedo
  } = useUndoRedo(initialState, maxHistorySize);

  const handleUndo = React.useCallback(() => {
    undo();
    // wait for state update to flush, then emit
    setTimeout(() => onStateChange(getCurrentState()), 0);
  }, [undo, getCurrentState, onStateChange]);

  const handleRedo = React.useCallback(() => {
    redo();
    setTimeout(() => onStateChange(getCurrentState()), 0);
  }, [redo, getCurrentState, onStateChange]);

  const handleClearHistory = React.useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  const historyInfo = getHistoryInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="w-4 h-4" />
          History & Undo/Redo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleUndo} disabled={!canUndo} variant="outline" size="sm" className="flex-1">
            <Undo className="w-3 h-3 mr-1" />
            Undo
          </Button>
          <Button onClick={handleRedo} disabled={!canRedo} variant="outline" size="sm" className="flex-1">
            <Redo className="w-3 h-3 mr-1" />
            Redo
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>History Size</span>
            <Badge variant="outline">
              {historyInfo.currentIndex + 1} / {historyInfo.totalStates}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Can Undo: {canUndo ? '✓' : '✗'}</span>
              <span>Can Redo: {canRedo ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>

        {historyInfo.recentActions.length > 1 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Recent Actions</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {historyInfo.recentActions.map((state, index) => (
                <div
                  key={`${state.timestamp}-${index}`}
                  className={`text-xs p-1 rounded ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{state.action || 'Unknown action'}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs py-0">Current</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {state.nodes.length} nodes, {state.edges.length} edges
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleClearHistory} variant="ghost" size="sm" className="w-full text-muted-foreground">
          <RotateCcw className="w-3 h-3 mr-1" />
          Clear History
        </Button>

        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div>Ctrl+Z: Undo</div>
          <div>Ctrl+Y: Redo</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Keyboard shortcuts hook
// Keep the same signature for compatibility, but only depend on stable undo/redo.
// We always call undo/redo; the functions themselves no-op when not possible.
export function useUndoRedoKeyboards(
  undo: () => void,
  redo: () => void,
  _canUndo: boolean,
  _canRedo: boolean
) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
}
