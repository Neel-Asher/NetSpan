import type { Node, Edge } from './KruskalAlgorithm';
interface GraphVisualizationProps {
    nodes: Node[];
    edges: Edge[];
    selectedNodes?: string[];
    onNodeDrag?: (nodeId: string, x: number, y: number) => void;
    onNodeClick?: (nodeId: string) => void;
    onEdgeClick?: (edgeId: string) => void;
    width: number;
    height: number;
    isInteractive?: boolean;
}
export declare function GraphVisualization({ nodes, edges, selectedNodes, onNodeDrag, onNodeClick, onEdgeClick, width, height, isInteractive }: GraphVisualizationProps): import("react/jsx-runtime").JSX.Element;
export {};
