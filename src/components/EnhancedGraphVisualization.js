import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ZoomIn, ZoomOut, RotateCcw, Settings, Eye, EyeOff, Maximize, Layout } from 'lucide-react';
import { applyLayout } from './GraphLayouts';
export function EnhancedGraphVisualization({ nodes, edges, selectedNodes, onNodeDrag, onNodeClick, onNodesUpdate, width, height, isInteractive, layout = 'manual', onLayoutChange }) {
    const svgRef = React.useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [draggedNode, setDraggedNode] = React.useState(null);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    // Pan and zoom state
    const [transform, setTransform] = React.useState({ x: 0, y: 0, scale: 1 });
    const [isPanning, setIsPanning] = React.useState(false);
    const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
    // View settings
    const [viewSettings, setViewSettings] = React.useState({
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
    const handleMouseDown = React.useCallback((e) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect)
            return;
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
        }
        else if (e.button === 0) { // Left click for panning
            setIsPanning(true);
            setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
        }
    }, [nodes, transform, viewSettings.nodeSize, isInteractive, onNodeClick]);
    const handleMouseMove = React.useCallback((e) => {
        if (isDragging && draggedNode && isInteractive) {
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect)
                return;
            const x = (e.clientX - rect.left - transform.x) / transform.scale - dragStart.x;
            const y = (e.clientY - rect.top - transform.y) / transform.scale - dragStart.y;
            onNodeDrag(draggedNode, x, y);
        }
        else if (isPanning) {
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
    const handleZoom = (factor) => {
        setTransform(prev => ({
            ...prev,
            scale: Math.max(0.1, Math.min(3, prev.scale * factor))
        }));
    };
    const handleReset = () => {
        setTransform({ x: 0, y: 0, scale: 1 });
    };
    const handleFitToView = () => {
        if (nodes.length === 0)
            return;
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
    const handleWheel = React.useCallback((e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        handleZoom(zoomFactor);
    }, []);
    const getNodeColor = (node) => {
        if (selectedNodes.includes(node.id))
            return '#3b82f6';
        return '#6b7280';
    };
    const getEdgeColor = (edge) => {
        switch (edge.status) {
            case 'accepted': return '#10b981';
            case 'rejected': return '#ef4444';
            case 'considering': return '#f59e0b';
            default: return '#9ca3af';
        }
    };
    const getEdgeWidth = (edge) => {
        const baseWidth = viewSettings.edgeWidth;
        return edge.status === 'accepted' ? baseWidth + 1 : baseWidth;
    };
    return (_jsxs("div", { className: "relative", children: [showControls && (_jsxs(Card, { className: "absolute top-2 right-2 z-10 w-80", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-sm flex items-center justify-between", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "w-4 h-4" }), "Visualization Controls"] }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0", onClick: () => setShowControls(false), children: _jsx(EyeOff, { className: "w-3 h-3" }) })] }) }), _jsxs(CardContent, { className: "space-y-4 pt-0", children: [onLayoutChange && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-xs", children: "Layout" }), _jsxs(Select, { value: layout, onValueChange: (value) => onLayoutChange(value), children: [_jsx(SelectTrigger, { className: "h-8 text-xs", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "manual", children: "Manual" }), _jsx(SelectItem, { value: "circular", children: "Circular" }), _jsx(SelectItem, { value: "force-directed", children: "Force-Directed" }), _jsx(SelectItem, { value: "hierarchical", children: "Hierarchical" }), _jsx(SelectItem, { value: "grid", children: "Grid" })] })] })] })), _jsx(Separator, {}), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { className: "text-xs", children: "Node Labels" }), _jsx(Switch, { checked: viewSettings.showNodeLabels, onCheckedChange: (checked) => setViewSettings(prev => ({ ...prev, showNodeLabels: checked })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { className: "text-xs", children: "Edge Labels" }), _jsx(Switch, { checked: viewSettings.showEdgeLabels, onCheckedChange: (checked) => setViewSettings(prev => ({ ...prev, showEdgeLabels: checked })) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { className: "text-xs", children: "Edge Weights" }), _jsx(Switch, { checked: viewSettings.showEdgeWeights, onCheckedChange: (checked) => setViewSettings(prev => ({ ...prev, showEdgeWeights: checked })) })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs(Label, { className: "text-xs", children: ["Node Size: ", viewSettings.nodeSize, "px"] }), _jsx("input", { type: "range", min: "10", max: "40", value: viewSettings.nodeSize, onChange: (e) => setViewSettings(prev => ({ ...prev, nodeSize: parseInt(e.target.value) })), className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" })] }), _jsxs("div", { children: [_jsxs(Label, { className: "text-xs", children: ["Edge Width: ", viewSettings.edgeWidth, "px"] }), _jsx("input", { type: "range", min: "1", max: "6", value: viewSettings.edgeWidth, onChange: (e) => setViewSettings(prev => ({ ...prev, edgeWidth: parseInt(e.target.value) })), className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" })] })] })] })] })), _jsxs("div", { className: "absolute top-2 left-2 z-10 flex flex-col gap-1", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleZoom(1.2), className: "h-8 w-8 p-0", children: _jsx(ZoomIn, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleZoom(0.8), className: "h-8 w-8 p-0", children: _jsx(ZoomOut, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleReset, className: "h-8 w-8 p-0", children: _jsx(RotateCcw, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleFitToView, className: "h-8 w-8 p-0", children: _jsx(Maximize, { className: "w-3 h-3" }) })] }), _jsx("div", { className: "absolute top-2 right-2 z-10", children: !showControls && (_jsx(Button, { variant: "outline", size: "sm", onClick: () => setShowControls(true), className: "h-8 w-8 p-0", children: _jsx(Eye, { className: "w-3 h-3" }) })) }), _jsx("div", { className: "absolute bottom-2 left-2 z-10", children: _jsxs(Badge, { variant: "outline", className: "text-xs", children: [(transform.scale * 100).toFixed(0), "%"] }) }), _jsxs("svg", { ref: svgRef, width: width, height: height, className: "border border-border rounded-lg bg-card cursor-grab active:cursor-grabbing", style: { touchAction: 'none' }, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, onWheel: handleWheel, children: [_jsx("defs", { children: _jsx("pattern", { id: "grid", width: "20", height: "20", patternUnits: "userSpaceOnUse", children: _jsx("path", { d: "M 20 0 L 0 0 0 20", fill: "none", stroke: "#e5e7eb", strokeWidth: "0.5", opacity: "0.3" }) }) }), _jsx("rect", { width: width, height: height, fill: "url(#grid)" }), _jsxs("g", { transform: `translate(${transform.x}, ${transform.y}) scale(${transform.scale})`, children: [edges.map(edge => {
                                const sourceNode = nodes.find(n => n.id === edge.source);
                                const targetNode = nodes.find(n => n.id === edge.target);
                                if (!sourceNode || !targetNode)
                                    return null;
                                const midX = (sourceNode.x + targetNode.x) / 2;
                                const midY = (sourceNode.y + targetNode.y) / 2;
                                return (_jsxs("g", { children: [_jsx("line", { x1: sourceNode.x, y1: sourceNode.y, x2: targetNode.x, y2: targetNode.y, stroke: getEdgeColor(edge), strokeWidth: getEdgeWidth(edge), strokeDasharray: edge.status === 'considering' ? '5,5' : 'none' }), viewSettings.showEdgeWeights && (_jsx("text", { x: midX, y: midY - 5, textAnchor: "middle", fontSize: "10", fill: "currentColor", className: "pointer-events-none select-none", children: edge.weight })), viewSettings.showEdgeLabels && edge.id && (_jsx("text", { x: midX, y: midY + 12, textAnchor: "middle", fontSize: "8", fill: "currentColor", className: "pointer-events-none select-none opacity-70", children: edge.id }))] }, edge.id));
                            }), nodes.map(node => (_jsxs("g", { children: [_jsx("circle", { cx: node.x, cy: node.y, r: viewSettings.nodeSize, fill: getNodeColor(node), stroke: "#ffffff", strokeWidth: "2", className: isInteractive ? "cursor-pointer" : "cursor-default", style: { filter: selectedNodes.includes(node.id) ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none' } }), viewSettings.showNodeLabels && (_jsx("text", { x: node.x, y: node.y + viewSettings.nodeSize + 12, textAnchor: "middle", fontSize: "12", fill: "currentColor", className: "pointer-events-none select-none font-medium", children: node.name }))] }, node.id)))] })] })] }));
}
