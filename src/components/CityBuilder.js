import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Trash2, Plus, MapPin, Zap } from 'lucide-react';
export function CityBuilder({ nodes, edges, selectedNodes, onAddNode, onDeleteNode, onAddEdge, onDeleteEdge, onGenerateRandom, onClearAll, onNodeSelect }) {
    const [newCityName, setNewCityName] = React.useState('');
    const [edgeWeight, setEdgeWeight] = React.useState('');
    const handleAddCity = () => {
        if (!newCityName.trim())
            return;
        const name = newCityName.trim();
        // Generate random position
        const x = Math.random() * 400 + 100;
        const y = Math.random() * 300 + 100;
        onAddNode({ name, x, y });
        setNewCityName('');
    };
    const handleNodeSelect = (nodeId) => {
        if (selectedNodes.includes(nodeId)) {
            onNodeSelect(selectedNodes.filter(id => id !== nodeId));
        }
        else if (selectedNodes.length < 2) {
            onNodeSelect([...selectedNodes, nodeId]);
        }
        else {
            onNodeSelect([nodeId]);
        }
    };
    const handleAddEdge = () => {
        if (selectedNodes.length !== 2 || !edgeWeight.trim())
            return;
        const weight = parseInt(edgeWeight.trim());
        if (isNaN(weight) || weight <= 0)
            return;
        // Check if edge already exists
        const edgeExists = edges.some(edge => (edge.source === selectedNodes[0] && edge.target === selectedNodes[1]) ||
            (edge.source === selectedNodes[1] && edge.target === selectedNodes[0]));
        if (edgeExists)
            return;
        onAddEdge({
            source: selectedNodes[0],
            target: selectedNodes[1],
            weight
        });
        onNodeSelect([]);
        setEdgeWeight('');
    };
    const getNodeName = (nodeId) => {
        return nodes.find(n => n.id === nodeId)?.name || nodeId;
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), "Quick Actions"] }) }), _jsx(CardContent, { className: "space-y-3", children: _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Button, { onClick: onGenerateRandom, variant: "outline", size: "sm", children: "Generate Random" }), _jsx(Button, { onClick: onClearAll, variant: "outline", size: "sm", disabled: nodes.length === 0, children: "Clear All" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Add City" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "cityName", children: "City Name" }), _jsx(Input, { id: "cityName", value: newCityName, onChange: (e) => setNewCityName(e.target.value), placeholder: "Enter city name...", onKeyDown: (e) => e.key === 'Enter' && handleAddCity() })] }), _jsxs(Button, { onClick: handleAddCity, disabled: !newCityName.trim(), className: "w-full", size: "sm", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add City"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5" }), "Add Power Line"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Selected Cities" }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [selectedNodes.length === 0 && "Click cities in the graph to select them", selectedNodes.length === 1 && `${getNodeName(selectedNodes[0])} (select one more)`, selectedNodes.length === 2 && `${getNodeName(selectedNodes[0])} ↔ ${getNodeName(selectedNodes[1])}`] })] }), selectedNodes.length === 2 && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "edgeWeight", children: "Connection Cost" }), _jsx(Input, { id: "edgeWeight", value: edgeWeight, onChange: (e) => setEdgeWeight(e.target.value), placeholder: "Enter cost...", type: "number", min: "1", onKeyDown: (e) => e.key === 'Enter' && handleAddEdge() })] }), _jsx(Button, { onClick: handleAddEdge, disabled: !edgeWeight.trim() || parseInt(edgeWeight) <= 0, className: "w-full", size: "sm", children: "Add Connection" })] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Cities (", nodes.length, ")"] }) }), _jsx(CardContent, { className: "space-y-2", children: nodes.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "No cities added yet" })) : (_jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: nodes.map(node => (_jsxs("div", { className: `flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${selectedNodes.includes(node.id)
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-muted/50 hover:bg-muted'}`, onClick: () => handleNodeSelect(node.id), children: [_jsx("span", { className: "text-sm", children: node.name }), _jsx(Button, { onClick: (e) => {
                                            e.stopPropagation();
                                            onDeleteNode(node.id);
                                            onNodeSelect(selectedNodes.filter(id => id !== node.id));
                                        }, variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: _jsx(Trash2, { className: "w-3 h-3" }) })] }, node.id))) })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Power Lines (", edges.length, ")"] }) }), _jsx(CardContent, { className: "space-y-2", children: edges.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "No connections added yet" })) : (_jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: edges.map(edge => (_jsxs("div", { className: "flex items-center justify-between p-2 rounded bg-muted/50", children: [_jsxs("div", { className: "text-sm", children: [_jsxs("div", { children: [getNodeName(edge.source), " \u2194 ", getNodeName(edge.target)] }), _jsxs(Badge, { variant: "secondary", className: "text-xs mt-1", children: ["Cost: ", edge.weight] })] }), _jsx(Button, { onClick: () => onDeleteEdge(edge.id), variant: "ghost", size: "sm", className: "h-6 w-6 p-0", children: _jsx(Trash2, { className: "w-3 h-3" }) })] }, edge.id))) })) })] })] }));
}
