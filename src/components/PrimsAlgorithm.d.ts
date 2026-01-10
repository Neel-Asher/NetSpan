import type { Node, Edge } from './KruskalAlgorithm';
export interface PrimState {
    step: number;
    totalSteps: number;
    completed: boolean;
    mstEdges: Edge[];
    totalCost: number;
    visitedNodes: Set<string>;
    candidateEdges: Edge[];
    currentEdge: Edge | null;
    explanation: string;
    startNode: string;
    currentStep: number;
    startTime: number;
}
export declare function initializePrimsAlgorithm(nodes: Node[], edges: Edge[]): PrimState;
export declare function executePrimStep(state: PrimState, nodes: Node[], edges: Edge[]): PrimState;
export declare function getPrimEdgesForVisualization(state: PrimState, allEdges: Edge[]): Edge[];
