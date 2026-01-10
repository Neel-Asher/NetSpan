import type { Node, Edge } from './KruskalAlgorithm';
import { type LayoutType } from './GraphLayouts';
interface EnhancedGraphVisualizationProps {
    nodes: Node[];
    edges: Edge[];
    selectedNodes: string[];
    onNodeDrag: (nodeId: string, x: number, y: number) => void;
    onNodeClick: (nodeId: string) => void;
    onNodesUpdate?: (nodes: Node[]) => void;
    width: number;
    height: number;
    isInteractive: boolean;
    layout?: LayoutType;
    onLayoutChange?: (layout: LayoutType) => void;
}
export declare function EnhancedGraphVisualization({ nodes, edges, selectedNodes, onNodeDrag, onNodeClick, onNodesUpdate, width, height, isInteractive, layout, onLayoutChange }: EnhancedGraphVisualizationProps): import("react/jsx-runtime").JSX.Element;
export {};
