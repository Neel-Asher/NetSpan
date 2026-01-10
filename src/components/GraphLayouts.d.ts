import type { Node, Edge } from './KruskalAlgorithm';
export type LayoutType = 'manual' | 'circular' | 'force-directed' | 'hierarchical' | 'grid';
export interface LayoutOptions {
    width: number;
    height: number;
    padding?: number;
}
export declare function applyForceDirectedLayout(nodes: Node[], edges: Edge[], options: LayoutOptions, iterations?: number): Node[];
export declare function applyCircularLayout(nodes: Node[], options: LayoutOptions): Node[];
export declare function applyHierarchicalLayout(nodes: Node[], edges: Edge[], options: LayoutOptions): Node[];
export declare function applyGridLayout(nodes: Node[], options: LayoutOptions): Node[];
export declare function applyLayout(nodes: Node[], edges: Edge[], layoutType: LayoutType, options: LayoutOptions): Node[];
