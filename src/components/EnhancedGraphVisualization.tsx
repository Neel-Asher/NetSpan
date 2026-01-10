import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ZoomIn, ZoomOut, RotateCcw, Settings, Eye, EyeOff, Maximize} from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';
import { type LayoutType, applyLayout } from './GraphLayouts';

interface ViewSettings {
  showNodeLabels: boolean;
  showEdgeLabels: boolean;
  showEdgeWeights: boolean;
  nodeSize: number;
  edgeWidth: number;
}

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

export function EnhancedGraphVisualization({
  nodes,
  edges,
  selectedNodes,
  onNodeDrag,
  onNodeClick,
  onNodesUpdate,
  width,
  height,
  isInteractive,
  layout = 'manual',
  onLayoutChange
}: EnhancedGraphVisualizationProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedNode, setDraggedNode] = React.useState<string | null>(null);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  
  // Pan and zoom state
  const [transform, setTransform] = React.useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
  
  // View settings
  const [viewSettings, setViewSettings] = React.useState<ViewSettings>({
    showNodeLabels: true,
    showEdgeLabels: false,
    showEdgeWeights: true,
    nodeSize: 20,
    edgeWidth: 2
  });
  
  const [showControls, setShowControls] = React.useState(false);

  // Apply layout when layout type changes
  React.useEffect(() => {
    if (layout !== 'manual' && onNodesUpdate) {
      const layoutNodes = applyLayout(nodes, edges, layout, { width, height, padding: 50 });
      onNodesUpdate(layoutNodes);
    }
  }, [layout, width, height]);

  // Handle mouse events for dragging and panning
  const handleMouseDown = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= viewSettings.nodeSize;
    });

    if (clickedNode && isInteractive) {
      setIsDragging(true);
      setDraggedNode(clickedNode.id);
      setDragStart({ x: x - clickedNode.x, y: y - clickedNode.y });
      onNodeClick(clickedNode.id);
    } else if (e.button === 0) { // Left click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [nodes, transform, viewSettings.nodeSize, isInteractive, onNodeClick]);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<SVGElement>) => {
    if (isDragging && draggedNode && isInteractive) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - transform.x) / transform.scale - dragStart.x;
      const y = (e.clientY - rect.top - transform.y) / transform.scale - dragStart.y;
      
      onNodeDrag(draggedNode, x, y);
    } else if (isPanning) {
      const newX = e.clientX - panStart.x;
      const newY = e.clientY - panStart.y;
      setTransform(prev => ({ ...prev, x: newX, y: newY }));
    }
  }, [isDragging, draggedNode, dragStart, transform, panStart, isPanning, onNodeDrag, isInteractive]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
    setIsPanning(false);
  }, []);

  // Zoom functions
  const handleZoom = (factor: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale * factor))
    }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleFitToView = () => {
    if (nodes.length === 0) return;
    
    const padding = 50;
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const minY = Math.min(...nodes.map(n => n.y)) - padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    const scaleX = width / contentWidth;
    const scaleY = height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const translateX = width / 2 - centerX * scale;
    const translateY = height / 2 - centerY * scale;
    
    setTransform({ x: translateX, y: translateY, scale });
  };

  // Handle wheel zoom
  const handleWheel = React.useCallback((e: React.WheelEvent<SVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    handleZoom(zoomFactor);
  }, []);

  const getNodeColor = (node: Node) => {
    if (selectedNodes.includes(node.id)) return '#3b82f6';
    return '#6b7280';
  };

  const getEdgeColor = (edge: Edge) => {
    switch (edge.status) {
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'considering': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  const getEdgeWidth = (edge: Edge) => {
    const baseWidth = viewSettings.edgeWidth;
    return edge.status === 'accepted' ? baseWidth + 1 : baseWidth;
  };

  return (
    <div className="relative">
      {/* Controls Panel */}
      {showControls && (
        <Card className="absolute top-2 right-2 z-10 w-80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Visualization Controls
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowControls(false)}
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Layout Selection */}
            {onLayoutChange && (
              <div className="space-y-2">
                <Label className="text-xs">Layout</Label>
                <Select value={layout} onValueChange={(value: LayoutType) => onLayoutChange(value)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="force-directed">Force-Directed</SelectItem>
                    <SelectItem value="hierarchical">Hierarchical</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Separator />
            
            {/* Display Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Node Labels</Label>
                <Switch
                  checked={viewSettings.showNodeLabels}
                  onCheckedChange={(checked) => 
                    setViewSettings(prev => ({ ...prev, showNodeLabels: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Edge Labels</Label>
                <Switch
                  checked={viewSettings.showEdgeLabels}
                  onCheckedChange={(checked) => 
                    setViewSettings(prev => ({ ...prev, showEdgeLabels: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Edge Weights</Label>
                <Switch
                  checked={viewSettings.showEdgeWeights}
                  onCheckedChange={(checked) => 
                    setViewSettings(prev => ({ ...prev, showEdgeWeights: checked }))
                  }
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Size Controls */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Node Size: {viewSettings.nodeSize}px</Label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={viewSettings.nodeSize}
                  onChange={(e) => 
                    setViewSettings(prev => ({ ...prev, nodeSize: parseInt(e.target.value) }))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <Label className="text-xs">Edge Width: {viewSettings.edgeWidth}px</Label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={viewSettings.edgeWidth}
                  onChange={(e) => 
                    setViewSettings(prev => ({ ...prev, edgeWidth: parseInt(e.target.value) }))
                  }
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <Button variant="outline" size="sm" onClick={() => handleZoom(1.2)} className="h-8 w-8 p-0">
          <ZoomIn className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleZoom(0.8)} className="h-8 w-8 p-0">
          <ZoomOut className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
          <RotateCcw className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleFitToView} className="h-8 w-8 p-0">
          <Maximize className="w-3 h-3" />
        </Button>
      </div>

      {/* Settings Toggle */}
      <div className="absolute top-2 right-2 z-10">
        {!showControls && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowControls(true)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-2 left-2 z-10">
        <Badge variant="outline" className="text-xs">
          {(transform.scale * 100).toFixed(0)}%
        </Badge>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        
        <rect width={width} height={height} fill="url(#grid)" />
        
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Edges */}
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={getEdgeWidth(edge)}
                  strokeDasharray={edge.status === 'considering' ? '5,5' : 'none'}
                />
                
                {/* Edge Weight Label */}
                {viewSettings.showEdgeWeights && (
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    className="pointer-events-none select-none"
                  >
                    {edge.weight}
                  </text>
                )}
                
                {/* Edge Label */}
                {viewSettings.showEdgeLabels && edge.id && (
                  <text
                    x={midX}
                    y={midY + 12}
                    textAnchor="middle"
                    fontSize="8"
                    fill="currentColor"
                    className="pointer-events-none select-none opacity-70"
                  >
                    {edge.id}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={viewSettings.nodeSize}
                fill={getNodeColor(node)}
                stroke="#ffffff"
                strokeWidth="2"
                className={isInteractive ? "cursor-pointer" : "cursor-default"}
                style={{ filter: selectedNodes.includes(node.id) ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none' }}
              />
              
              {/* Node Label */}
              {viewSettings.showNodeLabels && (
                <text
                  x={node.x}
                  y={node.y + viewSettings.nodeSize + 12}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  className="pointer-events-none select-none font-medium"
                >
                  {node.name}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}