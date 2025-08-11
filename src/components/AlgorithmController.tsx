import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, Pause, SkipForward, RotateCcw, FastForward, GitCompare } from 'lucide-react';
import type { AlgorithmState, Edge } from './KruskalAlgorithm';
import type { PrimState } from './PrimsAlgorithm';

export type AlgorithmType = 'kruskal' | 'prim';

interface AlgorithmControllerProps {
  algorithmState: AlgorithmState | PrimState | null;
  algorithmType: AlgorithmType;
  isRunning: boolean;
  onStep: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (type: AlgorithmType) => void;
  speed: number;
  comparisonMode?: boolean;
  onToggleComparison?: () => void;
}

export function AlgorithmController({
  algorithmState,
  algorithmType,
  isRunning,
  onStep,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  speed,
  comparisonMode = false,
  onToggleComparison
}: AlgorithmControllerProps) {
  if (!algorithmState) return null;

  const progress = algorithmState.totalSteps > 0 
    ? (algorithmState.step / algorithmState.totalSteps) * 100 
    : 0;

  const getEdgeStatusBadge = (status: Edge['status']) => {
    const variants = {
      pending: 'secondary',
      considering: 'default',
      accepted: 'default',
      rejected: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAlgorithmTitle = () => {
    if (comparisonMode) return 'Algorithm Comparison';
    return algorithmType === 'kruskal' ? "Kruskal's Algorithm" : "Prim's Algorithm";
  };

  const getAlgorithmDescription = () => {
    if (algorithmType === 'kruskal') {
      return "Sorts all edges by weight and adds them if they don't create cycles. Uses Union-Find for cycle detection.";
    } else {
      return "Grows the MST from a starting vertex by always adding the minimum weight edge to an unvisited node.";
    }
  };

  return (
    <div className="space-y-4">
      {/* Algorithm Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {getAlgorithmTitle()}
            <Badge variant="outline">
              Step {algorithmState.step} / {algorithmState.totalSteps}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={algorithmType} onValueChange={onAlgorithmChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
                <SelectItem value="prim">Prim's Algorithm</SelectItem>
              </SelectContent>
            </Select>
            
            {onToggleComparison && (
              <Button
                onClick={onToggleComparison}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <GitCompare className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {getAlgorithmDescription()}
          </p>

          <Progress value={progress} className="w-full" />
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={isRunning ? onPause : onPlay}
              variant="default"
              size="sm"
              disabled={algorithmState.completed}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={onStep}
              variant="outline"
              size="sm"
              disabled={isRunning || algorithmState.completed}
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />
            
            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <FastForward className="w-4 h-4" />
              <select
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="px-2 py-1 text-xs border rounded bg-background border-border text-foreground"
              >
                <option value={2000}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={500}>2x</option>
                <option value={250}>4x</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">MST Edges</div>
              <div className="text-lg">{algorithmState.mstEdges.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-lg">{algorithmState.totalCost}</div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="text-sm text-muted-foreground mb-2">Progress</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Completed:</span>
                <span>{algorithmState.step}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Remaining:</span>
                <span>{algorithmState.totalSteps - algorithmState.step}</span>
              </div>
            </div>
          </div>

          {/* Algorithm-specific statistics */}
          {algorithmType === 'prim' && 'visitedNodes' in algorithmState && (
            <>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">Prim's Progress</div>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span>Visited Nodes:</span>
                    <span>{algorithmState.visitedNodes.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Candidate Edges:</span>
                    <span>{algorithmState.candidateEdges.length}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Step Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {algorithmState.explanation}
          </p>
          
          {algorithmState.currentEdge && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Edge:</span>
                {getEdgeStatusBadge(algorithmState.currentEdge.status)}
              </div>
              <div className="text-sm mt-1">
                {algorithmState.currentEdge.source} ↔ {algorithmState.currentEdge.target} 
                (Weight: {algorithmState.currentEdge.weight})
              </div>
            </div>
          )}

          {algorithmState.completed && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
                🎉 Algorithm Completed!
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                Minimum Spanning Tree found with total cost: {algorithmState.totalCost}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithm Comparison Info */}
      {comparisonMode && (
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs leading-relaxed">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <div className="font-medium text-blue-600 dark:text-blue-400">Kruskal's Algorithm</div>
                  <div className="text-muted-foreground">
                    • Global approach: considers all edges<br/>
                    • Uses Union-Find for cycle detection<br/>
                    • Time: O(E log E), Space: O(V)
                  </div>
                </div>
                <div>
                  <div className="font-medium text-green-600 dark:text-green-400">Prim's Algorithm</div>
                  <div className="text-muted-foreground">
                    • Local approach: grows from starting node<br/>
                    • Uses priority queue for edge selection<br/>
                    • Time: O(E log V), Space: O(V)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}