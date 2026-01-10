import type { Node, Edge } from './KruskalAlgorithm';
interface PerformanceMetricsProps {
    currentNodes: Node[];
    currentEdges: Edge[];
    recentExecutions?: {
        algorithm: 'kruskal' | 'prim';
        steps: number;
        time: number;
        nodes: number;
        edges: number;
    }[];
}
export declare function PerformanceMetrics({ currentNodes, currentEdges, recentExecutions }: PerformanceMetricsProps): import("react/jsx-runtime").JSX.Element;
export {};
