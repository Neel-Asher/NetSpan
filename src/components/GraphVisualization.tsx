import React from 'react';
import { motion } from 'motion/react';
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

export function GraphVisualization({
  nodes,
  edges,
  selectedNodes = [],
  onNodeDrag,
  onNodeClick,
  onEdgeClick,
  width,
  height,
  isInteractive = true
}: GraphVisualizationProps) {
  const [draggedNode, setDraggedNode] = React.useState<string | null>(null);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent, nodeId: string) => {
    if (!isInteractive || !onNodeDrag) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const svgRect = (event.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    if (!svgRect) return;

    setDraggedNode(nodeId);
    setDragOffset({
      x: event.clientX - svgRect.left - node.x,
      y: event.clientY - svgRect.top - node.y
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedNode || !onNodeDrag) return;

    const svgRect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const newX = Math.max(30, Math.min(width - 30, event.clientX - svgRect.left - dragOffset.x));
    const newY = Math.max(30, Math.min(height - 30, event.clientY - svgRect.top - dragOffset.y));

    onNodeDrag(draggedNode, newX, newY);
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const getEdgeColor = (edge: Edge) => {
    switch (edge.status) {
      case 'considering':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getEdgeWidth = (edge: Edge) => {
    return edge.status === 'accepted' ? 3 : edge.status === 'considering' ? 2 : 1;
  };

  const getNodeColor = (nodeId: string) => {
    // If node is selected in custom mode, show selection color
    if (selectedNodes.includes(nodeId)) {
      return '#8b5cf6'; // Purple for selected nodes
    }
    
    // If node is connected to current edge being considered in algorithm
    const connectedToCurrentEdge = edges.some(
      edge => edge.status === 'considering' && (edge.source === nodeId || edge.target === nodeId)
    );
    return connectedToCurrentEdge ? '#f59e0b' : '#3b82f6';
  };

  const getNodeStroke = (nodeId: string) => {
    // Add a thicker stroke for selected nodes
    if (selectedNodes.includes(nodeId)) {
      return { stroke: '#7c3aed', strokeWidth: '3' };
    }
    return { stroke: '#ffffff', strokeWidth: '2' };
  };

  return (
    <svg
      width={width}
      height={height}
      className="border border-border rounded-lg bg-card"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid pattern */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Edges */}
      {edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        return (
          <g key={edge.id}>
            <motion.line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={getEdgeColor(edge)}
              strokeWidth={getEdgeWidth(edge)}
              className="cursor-pointer"
              onClick={() => onEdgeClick?.(edge.id)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {/* Edge weight label */}
            <motion.text
              x={(sourceNode.x + targetNode.x) / 2}
              y={(sourceNode.y + targetNode.y) / 2}
              textAnchor="middle"
              dy="-5"
              className="text-xs fill-foreground pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {edge.weight}
            </motion.text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(node => {
        const nodeStroke = getNodeStroke(node.id);
        return (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={getNodeColor(node.id)}
              {...nodeStroke}
              className={`${isInteractive ? 'cursor-pointer' : ''} drop-shadow-sm`}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => onNodeClick?.(node.id)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={isInteractive ? { scale: 1.1 } : {}}
              whileTap={isInteractive ? { scale: 0.95 } : {}}
            />
            <motion.text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.3em"
              className="text-xs fill-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {node.name}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}