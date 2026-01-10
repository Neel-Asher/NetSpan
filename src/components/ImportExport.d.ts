import type { Node, Edge } from './KruskalAlgorithm';
export interface GraphData {
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    metadata: {
        created: string;
        version: string;
        nodeCount: number;
        edgeCount: number;
    };
}
interface ImportExportProps {
    nodes: Node[];
    edges: Edge[];
    onImport: (nodes: Node[], edges: Edge[], nodeIdCounter: number, edgeIdCounter: number) => void;
}
export declare function ImportExport({ nodes, edges, onImport }: ImportExportProps): import("react/jsx-runtime").JSX.Element;
export {};
