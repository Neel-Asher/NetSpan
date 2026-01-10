export interface Node {
    id: string;
    name: string;
    x: number;
    y: number;
}
export interface Edge {
    id: string;
    source: string;
    target: string;
    weight: number;
    status: 'pending' | 'considering' | 'accepted' | 'rejected';
}
export interface AlgorithmState {
    step: number;
    totalSteps: number;
    sortedEdges: Edge[];
    mstEdges: Edge[];
    totalCost: number;
    currentEdge: Edge | null;
    unionFind: Map<string, string>;
    completed: boolean;
    explanation: string;
    currentStep: number;
    startTime: number;
}
export declare class UnionFind {
    private parent;
    private rank;
    constructor(nodes: Node[]);
    find(x: string): string;
    union(x: string, y: string): boolean;
    connected(x: string, y: string): boolean;
    getComponents(): Map<string, string[]>;
}
export declare function initializeKruskalAlgorithm(nodes: Node[], edges: Edge[]): AlgorithmState;
export declare function executeKruskalStep(state: AlgorithmState, nodes: Node[]): AlgorithmState;
