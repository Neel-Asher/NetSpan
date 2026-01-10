import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, Legend } from 'recharts';
import { Activity, TrendingUp, Clock, Zap, Target, AlertTriangle } from 'lucide-react';
// Time complexity calculations
const calculateTheoreticalComplexity = (nodes, edges, algorithm) => {
    if (algorithm === 'kruskal') {
        // O(E log E) - dominated by sorting edges
        return edges * Math.log2(edges);
    }
    else {
        // O(V²) for simple implementation, O(E log V) with binary heap
        // Using O(E log V) as it's more common in practice
        return edges * Math.log2(nodes);
    }
};
// Generate performance data for different graph sizes
const generatePerformanceData = () => {
    const data = [];
    for (let n = 4; n <= 20; n += 2) {
        // Assume roughly complete graph for worst case: E = n(n-1)/2
        const edges = Math.floor((n * (n - 1)) / 2);
        // Simulate realistic step counts (with some randomness)
        const kruskalSteps = edges + n + Math.floor(Math.random() * 5);
        const primSteps = n * 2 + Math.floor(Math.random() * 3);
        // Simulate execution times (in ms)
        const kruskalTime = kruskalSteps * 0.8 + Math.random() * 10;
        const primTime = primSteps * 1.2 + Math.random() * 15;
        data.push({
            nodes: n,
            edges,
            kruskalSteps,
            primSteps,
            kruskalTime,
            primTime,
            theoreticalKruskal: calculateTheoreticalComplexity(n, edges, 'kruskal'),
            theoreticalPrim: calculateTheoreticalComplexity(n, edges, 'prim')
        });
    }
    return data;
};
const PERFORMANCE_DATA = generatePerformanceData();
export function PerformanceMetrics({ currentNodes, currentEdges, recentExecutions = [] }) {
    const [viewMode, setViewMode] = React.useState('complexity');
    const [complexityType, setComplexityType] = React.useState('steps');
    const currentGraphSize = currentNodes.length;
    const currentEdgeCount = currentEdges.length;
    // Calculate current graph metrics
    const currentMetrics = React.useMemo(() => {
        const kruskalComplexity = calculateTheoreticalComplexity(currentGraphSize, currentEdgeCount, 'kruskal');
        const primComplexity = calculateTheoreticalComplexity(currentGraphSize, currentEdgeCount, 'prim');
        return {
            nodes: currentGraphSize,
            edges: currentEdgeCount,
            density: currentGraphSize > 1 ? (currentEdgeCount / ((currentGraphSize * (currentGraphSize - 1)) / 2)) * 100 : 0,
            kruskalComplexity: Math.round(kruskalComplexity),
            primComplexity: Math.round(primComplexity),
            efficiency: kruskalComplexity < primComplexity ? 'Kruskal' : primComplexity < kruskalComplexity ? 'Prim' : 'Equal'
        };
    }, [currentGraphSize, currentEdgeCount]);
    // Prepare chart data based on view mode
    const getChartData = () => {
        switch (complexityType) {
            case 'steps':
                return PERFORMANCE_DATA.map(d => ({
                    nodes: d.nodes,
                    "Kruskal's": d.kruskalSteps,
                    "Prim's": d.primSteps
                }));
            case 'time':
                return PERFORMANCE_DATA.map(d => ({
                    nodes: d.nodes,
                    "Kruskal's": Math.round(d.kruskalTime),
                    "Prim's": Math.round(d.primTime)
                }));
            case 'theoretical':
                return PERFORMANCE_DATA.map(d => ({
                    nodes: d.nodes,
                    "Kruskal's O(E log E)": Math.round(d.theoreticalKruskal / 10), // Scale down for readability
                    "Prim's O(E log V)": Math.round(d.theoreticalPrim / 10)
                }));
            default:
                return [];
        }
    };
    const getYAxisLabel = () => {
        switch (complexityType) {
            case 'steps': return 'Algorithm Steps';
            case 'time': return 'Execution Time (ms)';
            case 'theoretical': return 'Theoretical Complexity (scaled)';
            default: return '';
        }
    };
    const getRecommendation = () => {
        const { nodes, edges, density } = currentMetrics;
        if (density < 30) {
            return {
                algorithm: 'Prim',
                reason: 'Sparse graph - Prim\'s algorithm is more efficient for graphs with fewer edges relative to vertices.',
                confidence: 'High'
            };
        }
        else if (density > 70) {
            return {
                algorithm: 'Kruskal',
                reason: 'Dense graph - Kruskal\'s algorithm handles dense graphs well due to efficient edge sorting.',
                confidence: 'Medium'
            };
        }
        else {
            return {
                algorithm: 'Either',
                reason: 'Medium density graph - both algorithms will perform similarly. Consider other factors like implementation complexity.',
                confidence: 'Medium'
            };
        }
    };
    const recommendation = getRecommendation();
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Activity, { className: "w-4 h-4" }), "Current Graph Analysis"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-muted rounded-lg", children: [_jsx("div", { className: "text-lg font-medium", children: currentMetrics.nodes }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Nodes" })] }), _jsxs("div", { className: "text-center p-3 bg-muted rounded-lg", children: [_jsx("div", { className: "text-lg font-medium", children: currentMetrics.edges }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Edges" })] }), _jsxs("div", { className: "text-center p-3 bg-muted rounded-lg", children: [_jsxs("div", { className: "text-lg font-medium", children: [currentMetrics.density.toFixed(1), "%"] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Density" })] }), _jsxs("div", { className: "text-center p-3 bg-muted rounded-lg", children: [_jsx("div", { className: "text-lg font-medium", children: currentMetrics.efficiency }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Predicted Winner" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Kruskal's Complexity" }), _jsxs("span", { children: [currentMetrics.kruskalComplexity, " operations"] })] }), _jsx(Progress, { value: Math.min((currentMetrics.kruskalComplexity / Math.max(currentMetrics.kruskalComplexity, currentMetrics.primComplexity)) * 100, 100), className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Prim's Complexity" }), _jsxs("span", { children: [currentMetrics.primComplexity, " operations"] })] }), _jsx(Progress, { value: Math.min((currentMetrics.primComplexity / Math.max(currentMetrics.kruskalComplexity, currentMetrics.primComplexity)) * 100, 100), className: "h-2" })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Target, { className: "w-4 h-4" }), "Algorithm Recommendation"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: recommendation.algorithm === 'Either' ? 'secondary' : 'default', className: "text-sm", children: ["Recommended: ", recommendation.algorithm] }), _jsxs(Badge, { variant: "outline", className: `text-xs ${recommendation.confidence === 'High' ? 'text-green-600 border-green-300' :
                                            recommendation.confidence === 'Medium' ? 'text-orange-600 border-orange-300' :
                                                'text-red-600 border-red-300'}`, children: [recommendation.confidence, " Confidence"] })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: recommendation.reason }), _jsxs("div", { className: "flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "text-xs text-orange-800", children: [_jsx("strong", { children: "Note:" }), " Recommendations are based on theoretical complexity. Actual performance may vary based on implementation details and data characteristics."] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(TrendingUp, { className: "w-4 h-4" }), "Performance Analysis"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs(Tabs, { value: viewMode, onValueChange: (value) => setViewMode(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "complexity", children: "Complexity Comparison" }), _jsx(TabsTrigger, { value: "comparison", children: "Algorithm Comparison" }), _jsx(TabsTrigger, { value: "real-time", children: "Real-time Metrics" })] }), _jsxs(TabsContent, { value: "complexity", className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Metric Type:" }), _jsxs(Select, { value: complexityType, onValueChange: (value) => setComplexityType(value), children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "steps", children: "Algorithm Steps" }), _jsx(SelectItem, { value: "time", children: "Execution Time" }), _jsx(SelectItem, { value: "theoretical", children: "Theoretical Complexity" })] })] })] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: getChartData(), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nodes", label: { value: 'Number of Nodes', position: 'insideBottom', offset: -5 } }), _jsx(YAxis, { label: { value: getYAxisLabel(), angle: -90, position: 'insideLeft' } }), _jsx(Tooltip, {}), _jsx(Legend, {}), Object.keys(getChartData()[0] || {}).filter(key => key !== 'nodes').map((key, index) => (_jsx(Line, { type: "monotone", dataKey: key, stroke: index === 0 ? '#3b82f6' : '#10b981', strokeWidth: 2 }, key)))] }) }) })] }), _jsx(TabsContent, { value: "comparison", className: "space-y-4", children: _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: PERFORMANCE_DATA.slice(0, 8), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nodes" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "kruskalSteps", fill: "#3b82f6", name: "Kruskal Steps" }), _jsx(Bar, { dataKey: "primSteps", fill: "#10b981", name: "Prim Steps" })] }) }) }) }), _jsx(TabsContent, { value: "real-time", className: "space-y-4", children: recentExecutions.length > 0 ? (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium", children: "Recent Executions" }), recentExecutions.slice(-5).map((execution, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-muted rounded", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "capitalize", children: execution.algorithm }), _jsxs("span", { className: "text-sm", children: [execution.nodes, " nodes, ", execution.edges, " edges"] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsxs("span", { children: [execution.steps, " steps"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), execution.time, "ms"] })] })] }, index)))] })) : (_jsxs("div", { className: "text-center text-muted-foreground py-8", children: [_jsx(Zap, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No recent executions to display" }), _jsx("p", { className: "text-sm", children: "Run some algorithms to see real-time performance metrics" })] })) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Clock, { className: "w-4 h-4" }), "Algorithm Complexity Reference"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Kruskal's Algorithm" }), _jsxs("div", { className: "space-y-1 text-muted-foreground", children: [_jsx("div", { children: "Time: O(E log E)" }), _jsx("div", { children: "Space: O(V)" }), _jsx("div", { children: "Best for: Sparse graphs" }), _jsx("div", { children: "Key operation: Sort all edges" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium", children: "Prim's Algorithm" }), _jsxs("div", { className: "space-y-1 text-muted-foreground", children: [_jsx("div", { children: "Time: O(E log V)" }), _jsx("div", { children: "Space: O(V)" }), _jsx("div", { children: "Best for: Dense graphs" }), _jsx("div", { children: "Key operation: Priority queue operations" })] })] })] }), _jsxs("div", { className: "text-xs text-muted-foreground p-2 bg-muted rounded", children: [_jsx("div", { className: "font-medium mb-1", children: "Legend:" }), _jsx("div", { children: "V = Number of vertices (nodes), E = Number of edges" })] })] }) })] })] }));
}
