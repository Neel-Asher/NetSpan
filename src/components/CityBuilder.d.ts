import type { Node, Edge } from './KruskalAlgorithm';
interface CityBuilderProps {
    nodes: Node[];
    edges: Edge[];
    selectedNodes: string[];
    onAddNode: (node: Omit<Node, 'id'>) => void;
    onDeleteNode: (nodeId: string) => void;
    onAddEdge: (edge: Omit<Edge, 'id' | 'status'>) => void;
    onDeleteEdge: (edgeId: string) => void;
    onGenerateRandom: () => void;
    onClearAll: () => void;
    onNodeSelect: (selectedNodes: string[]) => void;
}
export declare function CityBuilder({ nodes, edges, selectedNodes, onAddNode, onDeleteNode, onAddEdge, onDeleteEdge, onGenerateRandom, onClearAll, onNodeSelect }: CityBuilderProps): import("react/jsx-runtime").JSX.Element;
export {};
