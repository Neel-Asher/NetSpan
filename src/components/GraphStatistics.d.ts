import type { Node, Edge } from './KruskalAlgorithm';
interface GraphStatisticsProps {
    nodes: Node[];
    edges: Edge[];
    mstEdges?: Edge[];
    mstCost?: number;
}
export declare function GraphStatistics({ nodes, edges, mstEdges, mstCost }: GraphStatisticsProps): import("react/jsx-runtime").JSX.Element;
export {};
