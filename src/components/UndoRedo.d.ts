import type { Node, Edge } from './KruskalAlgorithm';
export interface GraphState {
    nodes: Node[];
    edges: Edge[];
    nodeIdCounter: number;
    edgeIdCounter: number;
    timestamp: number;
    action: string;
}
type SaveInput = GraphState | Partial<GraphState> | ((prev: GraphState) => GraphState | Partial<GraphState>);
interface UndoRedoProps {
    onStateChange: (state: GraphState) => void;
    maxHistorySize?: number;
}
export declare function useUndoRedo(initialState: GraphState, maxHistorySize?: number): {
    saveState: (input: SaveInput, action: string) => void;
    undo: () => void;
    redo: () => void;
    getCurrentState: () => GraphState;
    clearHistory: () => void;
    getHistoryInfo: () => {
        totalStates: number;
        currentIndex: number;
        canUndo: boolean;
        canRedo: boolean;
        recentActions: GraphState[];
    };
    canUndo: boolean;
    canRedo: boolean;
};
export declare function UndoRedoControls({ onStateChange, maxHistorySize }: UndoRedoProps): import("react/jsx-runtime").JSX.Element;
export declare function useUndoRedoKeyboards(undo: () => void, redo: () => void, _canUndo: boolean, _canRedo: boolean): void;
export {};
