import React from 'react';
import type { Node, Edge } from './KruskalAlgorithm';
export interface GraphTemplate {
    id: string;
    name: string;
    description: string;
    category: 'basic' | 'special' | 'real-world';
    nodes: Node[];
    edges: Edge[];
    icon: React.ReactNode;
    complexity: 'Simple' | 'Medium' | 'Complex';
    useCase: string;
}
interface GraphTemplatesProps {
    onApplyTemplate: (nodes: Node[], edges: Edge[], nodeCounter: number, edgeCounter: number) => void;
    onTemplateInfo?: (template: GraphTemplate) => void;
}
declare const GRAPH_TEMPLATES: GraphTemplate[];
export declare function GraphTemplates({ onApplyTemplate, onTemplateInfo }: GraphTemplatesProps): import("react/jsx-runtime").JSX.Element;
export { GRAPH_TEMPLATES };
