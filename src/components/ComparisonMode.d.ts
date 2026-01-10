import { type Node, type Edge } from './KruskalAlgorithm';
interface ComparisonModeProps {
    nodes: Node[];
    edges: Edge[];
    onNodeDrag: (nodeId: string, x: number, y: number) => void;
    onNodeClick: (nodeId: string) => void;
    selectedNodes: string[];
    speed: number;
    onSpeedChange: (speed: number) => void;
}
export declare function ComparisonMode({ nodes, edges, onNodeDrag, onNodeClick, selectedNodes, speed, onSpeedChange }: ComparisonModeProps): import("react/jsx-runtime").JSX.Element;
export {};
