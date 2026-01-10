import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, Pause, Square, RotateCcw, GitCompare, Timer, Award } from 'lucide-react';
import { EnhancedGraphVisualization } from './EnhancedGraphVisualization';
import { initializeKruskalAlgorithm, executeKruskalStep } from './KruskalAlgorithm';
import { initializePrimsAlgorithm, executePrimStep, getPrimEdgesForVisualization } from './PrimsAlgorithm';
export function ComparisonMode({ nodes, edges, onNodeDrag, onNodeClick, selectedNodes, speed, onSpeedChange }) {
    const [algorithms, setAlgorithms] = React.useState({
        left: {
            type: 'kruskal',
            state: null,
            isRunning: false,
            stepCount: 0,
            executionTime: 0,
            startTime: 0
        },
        right: {
            type: 'prim',
            state: null,
            isRunning: false,
            stepCount: 0,
            executionTime: 0,
            startTime: 0
        }
    });
    const [syncMode, setSyncMode] = React.useState('synchronized');
    const [comparisonResults, setComparisonResults] = React.useState(null);
    // Auto-step timer
    React.useEffect(() => {
        if (syncMode === 'synchronized') {
            const bothRunning = algorithms.left.isRunning && algorithms.right.isRunning;
            const bothComplete = algorithms.left.state?.completed && algorithms.right.state?.completed;
            if (bothRunning && !bothComplete) {
                const timer = setTimeout(() => {
                    executeStep('both');
                }, speed);
                return () => clearTimeout(timer);
            }
        }
        else {
            // Independent mode - handle each algorithm separately
            const timers = [];
            if (algorithms.left.isRunning && !algorithms.left.state?.completed) {
                timers.push(setTimeout(() => executeStep('left'), speed));
            }
            if (algorithms.right.isRunning && !algorithms.right.state?.completed) {
                timers.push(setTimeout(() => executeStep('right'), speed));
            }
            return () => timers.forEach(clearTimeout);
        }
    }, [algorithms, speed, syncMode]);
    const initializeAlgorithm = (side, algorithmType) => {
        const newState = algorithmType === 'kruskal'
            ? initializeKruskalAlgorithm(nodes, edges)
            : initializePrimsAlgorithm(nodes, edges);
        setAlgorithms(prev => ({
            ...prev,
            [side]: {
                type: algorithmType,
                state: newState,
                isRunning: false,
                stepCount: 0,
                executionTime: 0,
                startTime: Date.now()
            }
        }));
        setComparisonResults(null);
    };
    const executeStep = (target) => {
        setAlgorithms(prev => {
            const newAlgorithms = { ...prev };
            const executeForSide = (side) => {
                if (!newAlgorithms[side].state || newAlgorithms[side].state.completed)
                    return;
                let newState;
                if (newAlgorithms[side].type === 'kruskal') {
                    newState = executeKruskalStep(newAlgorithms[side].state, nodes);
                }
                else {
                    newState = executePrimStep(newAlgorithms[side].state, nodes, edges);
                }
                newAlgorithms[side] = {
                    ...newAlgorithms[side],
                    state: newState,
                    stepCount: newAlgorithms[side].stepCount + 1,
                    executionTime: Date.now() - newAlgorithms[side].startTime,
                    isRunning: newAlgorithms[side].isRunning && !newState.completed
                };
            };
            if (target === 'both' || target === 'left') {
                executeForSide('left');
            }
            if (target === 'both' || target === 'right') {
                executeForSide('right');
            }
            return newAlgorithms;
        });
    };
    const startAlgorithms = () => {
        if (!algorithms.left.state || !algorithms.right.state)
            return;
        setAlgorithms(prev => ({
            left: { ...prev.left, isRunning: true, startTime: Date.now() },
            right: { ...prev.right, isRunning: true, startTime: Date.now() }
        }));
    };
    const pauseAlgorithms = () => {
        setAlgorithms(prev => ({
            left: { ...prev.left, isRunning: false },
            right: { ...prev.right, isRunning: false }
        }));
    };
    const resetAlgorithms = () => {
        setAlgorithms({
            left: {
                type: algorithms.left.type,
                state: null,
                isRunning: false,
                stepCount: 0,
                executionTime: 0,
                startTime: 0
            },
            right: {
                type: algorithms.right.type,
                state: null,
                isRunning: false,
                stepCount: 0,
                executionTime: 0,
                startTime: 0
            }
        });
        setComparisonResults(null);
    };
    // Calculate comparison results when both algorithms complete
    React.useEffect(() => {
        if (algorithms.left.state?.completed && algorithms.right.state?.completed) {
            const leftEfficiency = algorithms.left.state.totalCost / algorithms.left.stepCount;
            const rightEfficiency = algorithms.right.state.totalCost / algorithms.right.stepCount;
            let winner = 'tie';
            if (algorithms.left.stepCount < algorithms.right.stepCount)
                winner = 'left';
            else if (algorithms.right.stepCount < algorithms.left.stepCount)
                winner = 'right';
            setComparisonResults({
                winner,
                metrics: {
                    steps: { left: algorithms.left.stepCount, right: algorithms.right.stepCount },
                    time: { left: algorithms.left.executionTime, right: algorithms.right.executionTime },
                    efficiency: { left: leftEfficiency, right: rightEfficiency }
                }
            });
        }
    }, [algorithms.left.state?.completed, algorithms.right.state?.completed]);
    const getEdgesForVisualization = (side) => {
        const algorithm = algorithms[side];
        if (!algorithm.state)
            return edges;
        if (algorithm.type === 'prim') {
            return getPrimEdgesForVisualization(algorithm.state, edges);
        }
        else {
            return algorithm.state.sortedEdges;
        }
    };
    const getProgress = (side) => {
        const algorithm = algorithms[side];
        if (!algorithm.state)
            return 0;
        const totalSteps = nodes.length - 1; // MST has n-1 edges
        return Math.min((algorithm.state.mstEdges.length / totalSteps) * 100, 100);
    };
    const canStart = algorithms.left.state && algorithms.right.state &&
        !algorithms.left.state.completed && !algorithms.right.state.completed;
    const isRunning = algorithms.left.isRunning || algorithms.right.isRunning;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(GitCompare, { className: "w-4 h-4" }), "Algorithm Comparison"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Left Algorithm" }), _jsxs(Select, { value: algorithms.left.type, onValueChange: (value) => initializeAlgorithm('left', value), disabled: isRunning, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "kruskal", children: "Kruskal's Algorithm" }), _jsx(SelectItem, { value: "prim", children: "Prim's Algorithm" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Right Algorithm" }), _jsxs(Select, { value: algorithms.right.type, onValueChange: (value) => initializeAlgorithm('right', value), disabled: isRunning, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "kruskal", children: "Kruskal's Algorithm" }), _jsx(SelectItem, { value: "prim", children: "Prim's Algorithm" })] })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Execution Mode" }), _jsxs(Select, { value: syncMode, onValueChange: (value) => setSyncMode(value), disabled: isRunning, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "synchronized", children: "Synchronized (Step Together)" }), _jsx(SelectItem, { value: "independent", children: "Independent (Run Separately)" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { onClick: startAlgorithms, disabled: !canStart || isRunning, size: "sm", children: [_jsx(Play, { className: "w-3 h-3 mr-1" }), "Start Both"] }), _jsxs(Button, { onClick: pauseAlgorithms, disabled: !isRunning, variant: "outline", size: "sm", children: [_jsx(Pause, { className: "w-3 h-3 mr-1" }), "Pause"] }), _jsxs(Button, { onClick: resetAlgorithms, variant: "outline", size: "sm", children: [_jsx(RotateCcw, { className: "w-3 h-3 mr-1" }), "Reset"] }), _jsx(Separator, { orientation: "vertical", className: "h-6" }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Timer, { className: "w-3 h-3" }), _jsx("span", { children: "Speed:" }), _jsxs(Select, { value: speed.toString(), onValueChange: (value) => onSpeedChange(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-20 h-7", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "2000", children: "0.5x" }), _jsx(SelectItem, { value: "1000", children: "1x" }), _jsx(SelectItem, { value: "500", children: "2x" }), _jsx(SelectItem, { value: "250", children: "4x" })] })] })] })] }), (!algorithms.left.state || !algorithms.right.state) && (_jsxs("div", { className: "flex gap-2", children: [!algorithms.left.state && (_jsxs(Button, { onClick: () => initializeAlgorithm('left', algorithms.left.type), variant: "outline", size: "sm", children: ["Initialize ", algorithms.left.type === 'kruskal' ? "Kruskal's" : "Prim's", " (Left)"] })), !algorithms.right.state && (_jsxs(Button, { onClick: () => initializeAlgorithm('right', algorithms.right.type), variant: "outline", size: "sm", children: ["Initialize ", algorithms.right.type === 'kruskal' ? "Kruskal's" : "Prim's", " (Right)"] }))] }))] })] }), comparisonResults && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [_jsx(Award, { className: "w-4 h-4" }), "Comparison Results"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "text-center", children: comparisonResults.winner === 'tie' ? (_jsx(Badge, { variant: "secondary", className: "text-lg px-4 py-2", children: "It's a Tie! Both algorithms performed equally well" })) : (_jsx(Badge, { variant: "default", className: "text-lg px-4 py-2", children: comparisonResults.winner === 'left'
                                        ? `${algorithms.left.type === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Wins!`
                                        : `${algorithms.right.type === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Wins!` })) }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: "Steps Taken" }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsxs("span", { children: ["Left: ", comparisonResults.metrics.steps.left] }), _jsxs("span", { children: ["Right: ", comparisonResults.metrics.steps.right] })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: "Execution Time" }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsxs("span", { children: ["Left: ", comparisonResults.metrics.time.left, "ms"] }), _jsxs("span", { children: ["Right: ", comparisonResults.metrics.time.right, "ms"] })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium", children: "Final MST Cost" }), _jsxs("div", { className: "flex justify-between mt-1", children: [_jsxs("span", { children: ["Left: ", algorithms.left.state?.totalCost] }), _jsxs("span", { children: ["Right: ", algorithms.right.state?.totalCost] })] })] })] })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between text-base", children: [_jsx("span", { children: algorithms.left.type === 'kruskal' ? "Kruskal's Algorithm" : "Prim's Algorithm" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "capitalize", children: algorithms.left.type }), algorithms.left.state && (_jsxs(Badge, { variant: "secondary", children: ["Cost: ", algorithms.left.state.totalCost] }))] })] }) }), _jsx(CardContent, { className: "space-y-4", children: algorithms.left.state && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [getProgress('left').toFixed(0), "%"] })] }), _jsx(Progress, { value: getProgress('left'), className: "h-2" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Steps: ", algorithms.left.stepCount] }), _jsxs("span", { children: ["Time: ", algorithms.left.executionTime, "ms"] })] })] }), _jsx(EnhancedGraphVisualization, { nodes: nodes, edges: getEdgesForVisualization('left'), selectedNodes: selectedNodes, onNodeDrag: onNodeDrag, onNodeClick: onNodeClick, width: 400, height: 300, isInteractive: false })] })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between text-base", children: [_jsx("span", { children: algorithms.right.type === 'kruskal' ? "Kruskal's Algorithm" : "Prim's Algorithm" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "capitalize", children: algorithms.right.type }), algorithms.right.state && (_jsxs(Badge, { variant: "secondary", children: ["Cost: ", algorithms.right.state.totalCost] }))] })] }) }), _jsx(CardContent, { className: "space-y-4", children: algorithms.right.state && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [getProgress('right').toFixed(0), "%"] })] }), _jsx(Progress, { value: getProgress('right'), className: "h-2" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Steps: ", algorithms.right.stepCount] }), _jsxs("span", { children: ["Time: ", algorithms.right.executionTime, "ms"] })] })] }), _jsx(EnhancedGraphVisualization, { nodes: nodes, edges: getEdgesForVisualization('right'), selectedNodes: selectedNodes, onNodeDrag: onNodeDrag, onNodeClick: onNodeClick, width: 400, height: 300, isInteractive: false })] })) })] })] })] }));
}
