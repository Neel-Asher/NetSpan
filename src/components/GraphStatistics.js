import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { BarChart3, Network, Zap, Target, TrendingUp, Info } from 'lucide-react';
export function GraphStatistics({ nodes, edges, mstEdges = [], mstCost = 0 }) {
    // Basic graph metrics
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const maxPossibleEdges = nodeCount > 1 ? (nodeCount * (nodeCount - 1)) / 2 : 0;
    const density = maxPossibleEdges > 0 ? (edgeCount / maxPossibleEdges) * 100 : 0;
    // Degree statistics
    const degrees = new Map();
    edges.forEach(edge => {
        degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
        degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
    });
    const degreeValues = Array.from(degrees.values());
    const avgDegree = degreeValues.length > 0 ? degreeValues.reduce((sum, deg) => sum + deg, 0) / degreeValues.length : 0;
    const maxDegree = degreeValues.length > 0 ? Math.max(...degreeValues) : 0;
    const minDegree = degreeValues.length > 0 ? Math.min(...degreeValues) : 0;
    // Weight statistics
    const weights = edges.map(e => e.weight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const avgWeight = weights.length > 0 ? totalWeight / weights.length : 0;
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
    const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
    // MST statistics
    const mstProgress = nodeCount > 1 ? (mstEdges.length / (nodeCount - 1)) * 100 : 0;
    const costSaving = totalWeight > 0 && mstCost > 0 ? ((totalWeight - mstCost) / totalWeight) * 100 : 0;
    // Connectivity analysis
    const isConnected = checkConnectivity(nodes, edges);
    const components = findConnectedComponents(nodes, edges);
    // Node centrality (simple degree centrality)
    const centralityScores = nodes.map(node => ({
        id: node.id,
        name: node.name,
        degree: degrees.get(node.id) || 0,
        centrality: maxDegree > 0 ? ((degrees.get(node.id) || 0) / maxDegree) * 100 : 0
    })).sort((a, b) => b.centrality - a.centrality);
    const topCentralNodes = centralityScores.slice(0, 3);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Graph Overview"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "text-center p-2 bg-muted rounded-lg", children: [_jsx("div", { className: "text-lg font-medium", children: nodeCount }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Nodes" })] }), _jsxs("div", { className: "text-center p-2 bg-muted rounded-lg", children: [_jsx("div", { className: "text-lg font-medium", children: edgeCount }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Edges" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Density" }), _jsxs("span", { children: [density.toFixed(1), "%"] })] }), _jsx(Progress, { value: Math.min(density, 100), className: "h-2" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [edgeCount, " of ", maxPossibleEdges, " possible connections"] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Network, { className: "w-4 h-4" }), "Connectivity"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: "Graph Status" }), _jsx(Badge, { variant: isConnected ? "default" : "destructive", children: isConnected ? "Connected" : "Disconnected" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: "Components" }), _jsx("span", { className: "text-sm font-medium", children: components.length })] }), components.length > 1 && (_jsxs("div", { className: "text-xs text-muted-foreground", children: ["Largest component: ", Math.max(...components.map(c => c.length)), " nodes"] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Target, { className: "w-4 h-4" }), "Node Degrees"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: minDegree }), _jsx("div", { className: "text-muted-foreground", children: "Min" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: avgDegree.toFixed(1) }), _jsx("div", { className: "text-muted-foreground", children: "Avg" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: maxDegree }), _jsx("div", { className: "text-muted-foreground", children: "Max" })] })] }), topCentralNodes.length > 0 && (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium mb-2", children: "Most Central Nodes" }), _jsx("div", { className: "space-y-1", children: topCentralNodes.map((node, index) => (_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { children: node.name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("span", { className: "text-muted-foreground", children: ["deg: ", node.degree] }), _jsx("div", { className: "w-12 h-1 bg-muted rounded", children: _jsx("div", { className: "h-full bg-primary rounded", style: { width: `${node.centrality}%` } }) })] })] }, node.id))) })] })] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(TrendingUp, { className: "w-4 h-4" }), "Edge Weights"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: minWeight }), _jsx("div", { className: "text-muted-foreground", children: "Min" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: avgWeight.toFixed(1) }), _jsx("div", { className: "text-muted-foreground", children: "Avg" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: maxWeight }), _jsx("div", { className: "text-muted-foreground", children: "Max" })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Total Weight" }), _jsx("span", { className: "font-medium", children: totalWeight })] })] })] }), mstEdges.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Zap, { className: "w-4 h-4" }), "MST Analysis"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [mstProgress.toFixed(0), "%"] })] }), _jsx(Progress, { value: mstProgress, className: "h-2" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [mstEdges.length, " of ", nodeCount - 1, " edges needed"] })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "MST Cost" }), _jsx("span", { className: "font-medium", children: mstCost })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Original Cost" }), _jsx("span", { className: "font-medium", children: totalWeight })] }), costSaving > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Cost Saving" }), _jsxs(Badge, { variant: "secondary", children: [costSaving.toFixed(1), "%"] })] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Saved ", totalWeight - mstCost, " units by using MST"] })] }))] })] })] })), _jsx(Card, { children: _jsx(CardContent, { className: "p-3", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Info, { className: "w-3 h-3 mt-0.5 text-muted-foreground flex-shrink-0" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [_jsxs("p", { children: [_jsx("strong", { children: "Density:" }), " Higher density means more connections relative to maximum possible."] }), _jsxs("p", { className: "mt-1", children: [_jsx("strong", { children: "Centrality:" }), " Nodes with higher degree are more connected and potentially more important."] })] })] }) }) })] }));
}
// Helper function to check if graph is connected
function checkConnectivity(nodes, edges) {
    if (nodes.length <= 1)
        return true;
    const adjacencyList = new Map();
    edges.forEach(edge => {
        if (!adjacencyList.has(edge.source))
            adjacencyList.set(edge.source, []);
        if (!adjacencyList.has(edge.target))
            adjacencyList.set(edge.target, []);
        adjacencyList.get(edge.source).push(edge.target);
        adjacencyList.get(edge.target).push(edge.source);
    });
    const visited = new Set();
    const stack = [nodes[0].id];
    while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current))
            continue;
        visited.add(current);
        const neighbors = adjacencyList.get(current) || [];
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        });
    }
    return visited.size === nodes.length;
}
// Helper function to find connected components
function findConnectedComponents(nodes, edges) {
    const adjacencyList = new Map();
    edges.forEach(edge => {
        if (!adjacencyList.has(edge.source))
            adjacencyList.set(edge.source, []);
        if (!adjacencyList.has(edge.target))
            adjacencyList.set(edge.target, []);
        adjacencyList.get(edge.source).push(edge.target);
        adjacencyList.get(edge.target).push(edge.source);
    });
    const visited = new Set();
    const components = [];
    nodes.forEach(node => {
        if (!visited.has(node.id)) {
            const component = [];
            const stack = [node.id];
            while (stack.length > 0) {
                const current = stack.pop();
                if (visited.has(current))
                    continue;
                visited.add(current);
                component.push(current);
                const neighbors = adjacencyList.get(current) || [];
                neighbors.forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                });
            }
            components.push(component);
        }
    });
    return components;
}
