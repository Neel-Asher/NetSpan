import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./components/ui/dropdown-menu";
import { Toaster } from "./components/ui/sonner";
import { Info, Menu, HelpCircle, Brain, Download, Upload, BookOpen, BarChart3, GitCompare, Network, Activity, History, } from "lucide-react";
import { EnhancedGraphVisualization } from "./components/EnhancedGraphVisualization";
import { GraphStatistics } from "./components/GraphStatistics";
import { AlgorithmController, } from "./components/AlgorithmController";
import { CityBuilder } from "./components/CityBuilder";
import { ThemeToggle } from "./components/ThemeToggle";
import { Tutorial, useTutorial } from "./components/Tutorial";
import { Quiz, useQuiz } from "./components/Quiz";
import { ImportExport } from "./components/ImportExport";
import { UndoRedoControls, useUndoRedoKeyboards, } from "./components/UndoRedo";
import { GraphTemplates } from "./components/GraphTemplates";
import { ComparisonMode } from "./components/ComparisonMode";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { initializeKruskalAlgorithm, executeKruskalStep, } from "./components/KruskalAlgorithm";
import { initializePrimsAlgorithm, executePrimStep, getPrimEdgesForVisualization, } from "./components/PrimsAlgorithm";
const logoImage = "./logo-transparent.png";
const SAMPLE_CITIES = [
    "City A",
    "City B",
    "City C",
    "City D",
    "City E",
    "City F",
    "City G",
    "City H",
];
function generateRandomGraph(numNodes = 6) {
    const nodes = [];
    const edges = [];
    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
        const cityName = SAMPLE_CITIES[i % SAMPLE_CITIES.length];
        const angle = (i / numNodes) * 2 * Math.PI;
        const radius = 150;
        const centerX = 300;
        const centerY = 200;
        nodes.push({
            id: `node-${i}`,
            name: `${cityName}${i > SAMPLE_CITIES.length - 1 ? i : ""}`,
            x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 100,
            y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 100,
        });
    }
    // Generate edges (create a connected graph with some extra edges)
    const edgeSet = new Set();
    let edgeId = 0;
    // Ensure connectivity by creating a spanning tree first
    for (let i = 1; i < numNodes; i++) {
        const source = `node-${Math.floor(Math.random() * i)}`;
        const target = `node-${i}`;
        const edgeKey = [source, target].sort().join("-");
        if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            edges.push({
                id: `edge-${edgeId++}`,
                source,
                target,
                weight: Math.floor(Math.random() * 50) + 10,
                status: "pending",
            });
        }
    }
    // Add some additional random edges
    const additionalEdges = Math.floor(numNodes * 0.5);
    for (let i = 0; i < additionalEdges; i++) {
        const source = `node-${Math.floor(Math.random() * numNodes)}`;
        const target = `node-${Math.floor(Math.random() * numNodes)}`;
        if (source !== target) {
            const edgeKey = [source, target].sort().join("-");
            if (!edgeSet.has(edgeKey)) {
                edgeSet.add(edgeKey);
                edges.push({
                    id: `edge-${edgeId++}`,
                    source,
                    target,
                    weight: Math.floor(Math.random() * 50) + 10,
                    status: "pending",
                });
            }
        }
    }
    return { nodes, edges };
}
export default function App() {
    const [mode, setMode] = React.useState("random");
    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);
    const [algorithmState, setAlgorithmState] = React.useState(null);
    const [algorithmType, setAlgorithmType] = React.useState("kruskal");
    const [isRunning, setIsRunning] = React.useState(false);
    const [speed, setSpeed] = React.useState(1000);
    const [nodeIdCounter, setNodeIdCounter] = React.useState(0);
    const [edgeIdCounter, setEdgeIdCounter] = React.useState(0);
    const [selectedNodes, setSelectedNodes] = React.useState([]);
    const [theme, setTheme] = React.useState("light");
    const [layout, setLayout] = React.useState("manual");
    // Performance tracking
    const [executionHistory, setExecutionHistory] = React.useState([]);
    // Feature hooks
    const tutorial = useTutorial();
    const quiz = useQuiz();
    // Simplified undo/redo - just for keyboard shortcuts, actual undo/redo is handled by the UndoRedoControls component
    const dummyUndo = React.useCallback(() => {
        // This will be handled by the UndoRedoControls component
    }, []);
    const dummyRedo = React.useCallback(() => {
        // This will be handled by the UndoRedoControls component
    }, []);
    // Keyboard shortcuts for undo/redo (simplified)
    useUndoRedoKeyboards(dummyUndo, dummyRedo, false, false);
    // Handle undo/redo state restoration
    const handleUndoRedoStateChange = React.useCallback((state) => {
        setNodes(state.nodes);
        setEdges(state.edges);
        setNodeIdCounter(state.nodeIdCounter);
        setEdgeIdCounter(state.edgeIdCounter);
        setAlgorithmState(null);
        setIsRunning(false);
        setSelectedNodes([]);
    }, []);
    // Initialize theme from localStorage or system preference
    React.useEffect(() => {
        const savedTheme = localStorage.getItem("netspan-theme");
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
            }
        }
        else {
            // Check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialTheme = prefersDark ? "dark" : "light";
            setTheme(initialTheme);
            if (initialTheme === "dark") {
                document.documentElement.classList.add("dark");
            }
        }
    }, []);
    // Toggle theme
    const toggleTheme = React.useCallback(() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
        else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("netspan-theme", newTheme);
    }, [theme]);
    // Initialize with random graph
    React.useEffect(() => {
        const { nodes: randomNodes, edges: randomEdges } = generateRandomGraph();
        setNodes(randomNodes);
        setEdges(randomEdges);
        setNodeIdCounter(randomNodes.length);
        setEdgeIdCounter(randomEdges.length);
    }, []);
    // Auto-step when running
    React.useEffect(() => {
        if (!isRunning || !algorithmState || algorithmState.completed)
            return;
        const timer = setTimeout(() => {
            handleStep();
        }, speed);
        return () => clearTimeout(timer);
    }, [isRunning, algorithmState, speed]);
    const handleModeChange = React.useCallback((newMode) => {
        setMode(newMode);
        setIsRunning(false);
        setAlgorithmState(null);
        setSelectedNodes([]);
        if (newMode === "random") {
            const { nodes: randomNodes, edges: randomEdges } = generateRandomGraph();
            setNodes(randomNodes);
            setEdges(randomEdges);
            setNodeIdCounter(randomNodes.length);
            setEdgeIdCounter(randomEdges.length);
        }
    }, []);
    const handleStartAlgorithm = React.useCallback(() => {
        if (nodes.length < 2)
            return;
        let newAlgorithmState;
        if (algorithmType === "kruskal") {
            newAlgorithmState = initializeKruskalAlgorithm(nodes, edges);
        }
        else {
            newAlgorithmState = initializePrimsAlgorithm(nodes, edges);
        }
        setAlgorithmState(newAlgorithmState);
        setIsRunning(false);
    }, [nodes, edges, algorithmType]);
    // const handleStep = React.useCallback(() => {
    //   if (!algorithmState) return;
    //   let newState: AlgorithmState | PrimState;
    //   if (algorithmType === "kruskal") {
    //     newState = executeKruskalStep(
    //       algorithmState as AlgorithmState,
    //       nodes,
    //     );
    //   } else {
    //     newState = executePrimStep(
    //       algorithmState as PrimState,
    //       nodes,
    //       edges,
    //     );
    //   }
    //   setAlgorithmState(newState);
    //   if (newState.completed) {
    //     setIsRunning(false);
    //     // Add to execution history
    //     const execution = {
    //       algorithm: algorithmType,
    //       steps: newState.currentStep || 0,
    //       time:
    //         Date.now() - (algorithmState.startTime || Date.now()),
    //       nodes: nodes.length,
    //       edges: edges.length,
    //     };
    //     setExecutionHistory((prev) => [
    //       ...prev.slice(-9),
    //       execution,
    //     ]); // Keep last 10 executions
    //   }
    // }, [algorithmState, algorithmType, nodes, edges]);
    const handleStep = React.useCallback(() => {
        if (!algorithmState)
            return;
        let newState;
        if (algorithmType === "kruskal") {
            newState = executeKruskalStep(algorithmState, nodes);
        }
        else {
            newState = executePrimStep(algorithmState, nodes, edges);
        }
        setAlgorithmState(newState);
        if (newState.completed) {
            setIsRunning(false);
            // Add to execution history
            const execution = {
                algorithm: algorithmType,
                // Access currentStep based on the algorithm type
                steps: algorithmType === "kruskal"
                    ? newState.currentStep
                    : newState.currentStep,
                // Access startTime based on the algorithm type
                time: Date.now() -
                    (algorithmType === "kruskal"
                        ? algorithmState.startTime
                        : algorithmState.startTime),
                nodes: nodes.length,
                edges: edges.length,
            };
            setExecutionHistory((prev) => [...prev.slice(-9), execution]); // Keep last 10 executions
        }
    }, [algorithmState, algorithmType, nodes, edges]);
    const handleReset = React.useCallback(() => {
        setIsRunning(false);
        setAlgorithmState(null);
    }, []);
    const handleAlgorithmChange = React.useCallback((newType) => {
        if (newType !== algorithmType) {
            setAlgorithmType(newType);
            setAlgorithmState(null);
            setIsRunning(false);
        }
    }, [algorithmType]);
    const handleNodeDrag = React.useCallback((nodeId, x, y) => {
        setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node)));
    }, []);
    const handleNodeClick = React.useCallback((nodeId) => {
        if (mode !== "custom")
            return;
        setSelectedNodes((prev) => {
            if (prev.includes(nodeId)) {
                return prev.filter((id) => id !== nodeId);
            }
            else if (prev.length < 2) {
                return [...prev, nodeId];
            }
            else {
                return [nodeId];
            }
        });
    }, [mode]);
    const handleAddNode = React.useCallback((nodeData) => {
        const newNode = {
            id: `node-${nodeIdCounter}`,
            ...nodeData,
        };
        setNodes((prev) => [...prev, newNode]);
        setNodeIdCounter((prev) => prev + 1);
    }, [nodeIdCounter]);
    const handleDeleteNode = React.useCallback((nodeId) => {
        const newNodes = nodes.filter((node) => node.id !== nodeId);
        const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        setNodes(newNodes);
        setEdges(newEdges);
        setSelectedNodes((prev) => prev.filter((id) => id !== nodeId));
    }, [nodes, edges]);
    const handleAddEdge = React.useCallback((edgeData) => {
        const newEdge = {
            id: `edge-${edgeIdCounter}`,
            status: "pending",
            ...edgeData,
        };
        setEdges((prev) => [...prev, newEdge]);
        setEdgeIdCounter((prev) => prev + 1);
    }, [edgeIdCounter]);
    const handleDeleteEdge = React.useCallback((edgeId) => {
        const newEdges = edges.filter((edge) => edge.id !== edgeId);
        setEdges(newEdges);
    }, [edges]);
    const handleGenerateRandom = React.useCallback(() => {
        const { nodes: randomNodes, edges: randomEdges } = generateRandomGraph(6);
        setNodes(randomNodes);
        setEdges(randomEdges);
        setNodeIdCounter(randomNodes.length);
        setEdgeIdCounter(randomEdges.length);
        setAlgorithmState(null);
        setIsRunning(false);
        setSelectedNodes([]);
    }, []);
    const handleClearAll = React.useCallback(() => {
        setNodes([]);
        setEdges([]);
        setAlgorithmState(null);
        setIsRunning(false);
        setSelectedNodes([]);
    }, []);
    const handleImport = React.useCallback((importedNodes, importedEdges, nodeCounter, edgeCounter) => {
        setNodes(importedNodes);
        setEdges(importedEdges);
        setNodeIdCounter(nodeCounter);
        setEdgeIdCounter(edgeCounter);
        setAlgorithmState(null);
        setIsRunning(false);
        setSelectedNodes([]);
        // Automatically switch to custom mode to show the imported graph
        setTimeout(() => {
            setMode("custom");
        }, 100);
    }, []);
    const handleApplyTemplate = React.useCallback((templateNodes, templateEdges, nodeCounter, edgeCounter) => {
        setNodes(templateNodes);
        setEdges(templateEdges);
        setNodeIdCounter(nodeCounter);
        setEdgeIdCounter(edgeCounter);
        setAlgorithmState(null);
        setIsRunning(false);
        setSelectedNodes([]);
        // Switch to custom mode to show the applied template
        setTimeout(() => {
            setMode("custom");
        }, 100);
    }, []);
    const handleNodesUpdate = React.useCallback((updatedNodes) => {
        setNodes(updatedNodes);
    }, []);
    const handleLayoutChange = React.useCallback((newLayout) => {
        setLayout(newLayout);
    }, []);
    // Get current edges for visualization
    const getCurrentEdges = React.useCallback(() => {
        if (!algorithmState)
            return edges;
        if (algorithmType === "prim") {
            return getPrimEdgesForVisualization(algorithmState, edges);
        }
        else {
            return algorithmState.sortedEdges;
        }
    }, [algorithmState, algorithmType, edges]);
    const currentEdges = getCurrentEdges();
    return (_jsxs("div", { className: "min-h-screen bg-background p-4 relative", children: [_jsx(Toaster, {}), _jsxs("div", { className: "fixed top-4 right-4 z-50 flex items-center gap-2", children: [_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "sm", className: "h-9 w-9 p-0", children: _jsx(Menu, { className: "w-4 h-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(DropdownMenuItem, { onClick: tutorial.openTutorial, children: [_jsx(BookOpen, { className: "w-4 h-4 mr-2" }), "Tutorial"] }), _jsxs(DropdownMenuItem, { onClick: quiz.openQuiz, children: [_jsx(Brain, { className: "w-4 h-4 mr-2" }), "Take Quiz"] }), _jsxs(DropdownMenuItem, { onClick: () => setMode("import"), children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import/Export"] }), _jsxs(DropdownMenuItem, { onClick: () => setMode("statistics"), children: [_jsx(BarChart3, { className: "w-4 h-4 mr-2" }), "Graph Statistics"] }), _jsxs(DropdownMenuItem, { onClick: () => setMode("comparison"), children: [_jsx(GitCompare, { className: "w-4 h-4 mr-2" }), "Algorithm Comparison"] }), _jsxs(DropdownMenuItem, { onClick: () => setMode("templates"), children: [_jsx(Network, { className: "w-4 h-4 mr-2" }), "Graph Templates"] }), _jsxs(DropdownMenuItem, { onClick: () => setMode("performance"), children: [_jsx(Activity, { className: "w-4 h-4 mr-2" }), "Performance Analysis"] })] })] }), _jsx(ThemeToggle, { theme: theme, onToggle: toggleTheme })] }), _jsx(Tutorial, { isOpen: tutorial.isOpen, onClose: tutorial.closeTutorial }), _jsx(Quiz, { isOpen: quiz.isOpen, onClose: quiz.closeQuiz }), _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "flex items-center justify-center", children: _jsx("h1", { className: "netspan-brand text-4xl", children: "NetSpan" }) }), _jsx("p", { className: "text-muted-foreground netspan-subtitle", children: "Interactive visualization of Minimum Spanning Tree algorithms for network optimization" })] }), _jsxs(Tabs, { value: mode, onValueChange: (value) => handleModeChange(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-7 max-w-4xl mx-auto", children: [_jsx(TabsTrigger, { value: "random", children: "Random" }), _jsx(TabsTrigger, { value: "custom", children: "Builder" }), _jsx(TabsTrigger, { value: "templates", children: "Templates" }), _jsx(TabsTrigger, { value: "comparison", children: "Compare" }), _jsx(TabsTrigger, { value: "performance", children: "Performance" }), _jsx(TabsTrigger, { value: "import", children: "Import" }), _jsx(TabsTrigger, { value: "statistics", children: "Stats" })] }), _jsx(TabsContent, { value: "import", className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsx(ImportExport, { nodes: nodes, edges: edges, onImport: handleImport }) }) }) }), _jsx("div", { children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [_jsx(Upload, { className: "w-8 h-8 text-muted-foreground" }), _jsx(Download, { className: "w-8 h-8 text-muted-foreground" })] }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Import and export your network graphs" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Current graph: ", nodes.length, " nodes, ", edges.length, " ", "edges"] }), _jsx(Button, { onClick: () => setMode("custom"), variant: "outline", className: "w-full", children: "Edit in Custom Builder" })] })] }) }) })] }) }), _jsx(TabsContent, { value: "statistics", className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsx(GraphStatistics, { nodes: nodes, edges: edges, mstEdges: algorithmState?.mstEdges || [], mstCost: algorithmState?.totalCost || 0 }) }) }) }), _jsx("div", { children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("div", { className: "flex items-center justify-center gap-2 mb-4", children: _jsx(BarChart3, { className: "w-8 h-8 text-muted-foreground" }) }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Detailed graph analysis and metrics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["Analyzing graph with ", nodes.length, " nodes and", " ", edges.length, " edges"] }), _jsx(Button, { onClick: () => setMode("custom"), variant: "outline", className: "w-full", children: "Edit Graph Structure" })] })] }) }) })] }) }), _jsx(TabsContent, { value: "templates", className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(GraphTemplates, { onApplyTemplate: handleApplyTemplate }) }), _jsx("div", { children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("div", { className: "flex items-center justify-center gap-2 mb-4", children: _jsx(Network, { className: "w-8 h-8 text-muted-foreground" }) }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Pre-built network topologies for learning and testing" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Choose from basic, special, or real-world graph templates" }), _jsx(Button, { onClick: () => setMode("custom"), variant: "outline", className: "w-full", children: "Edit in Builder" })] })] }) }) })] }) }), _jsx(TabsContent, { value: "comparison", className: "mt-6", children: _jsx(ComparisonMode, { nodes: nodes, edges: edges, onNodeDrag: handleNodeDrag, onNodeClick: handleNodeClick, selectedNodes: selectedNodes, speed: speed, onSpeedChange: setSpeed }) }), _jsx(TabsContent, { value: "performance", className: "mt-6", children: _jsx(PerformanceMetrics, { currentNodes: nodes, currentEdges: edges, recentExecutions: executionHistory }) }), _jsx(TabsContent, { value: "random", className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg", children: "Network Graph" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "outline", children: [nodes.length, " Nodes"] }), _jsxs(Badge, { variant: "outline", children: [edges.length, " Connections"] }), algorithmState && (_jsxs(Badge, { variant: "secondary", children: ["MST Cost: ", algorithmState.totalCost] })), _jsx(Badge, { variant: "outline", className: "capitalize", children: algorithmType })] })] }), _jsx(EnhancedGraphVisualization, { nodes: nodes, edges: currentEdges, selectedNodes: selectedNodes, onNodeDrag: handleNodeDrag, onNodeClick: handleNodeClick, onNodesUpdate: handleNodesUpdate, width: 600, height: 400, isInteractive: false, layout: layout, onLayoutChange: handleLayoutChange }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsxs(Button, { onClick: handleStartAlgorithm, disabled: nodes.length < 2 || isRunning, variant: "default", children: ["Start", " ", algorithmType === "kruskal" ? "Kruskal's" : "Prim's", " ", "Algorithm"] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Info, { className: "w-4 h-4" }), "Use the eye icon to customize visualization"] })] })] }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-2", children: [_jsx(HelpCircle, { className: "w-4 h-4" }), "About MST Algorithms"] }), _jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Both Kruskal's and Prim's algorithms find the minimum spanning tree, but use different approaches. Kruskal's sorts all edges globally, while Prim's grows the tree from a starting node. Try different layouts to better understand graph structure!" })] }) }) })] }), _jsxs("div", { className: "space-y-4", children: [algorithmState && (_jsx(AlgorithmController, { algorithmState: algorithmState, algorithmType: algorithmType, isRunning: isRunning, onStep: handleStep, onPlay: () => setIsRunning(true), onPause: () => setIsRunning(false), onReset: handleReset, onSpeedChange: setSpeed, onAlgorithmChange: handleAlgorithmChange, speed: speed })), !algorithmState && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("img", { src: logoImage, alt: "NetSpan Logo", className: "w-12 h-12 mx-auto mb-4 opacity-60" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Ready to optimize the network!" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Button, { onClick: handleGenerateRandom, variant: "outline", className: "w-full", children: "Generate New Random Graph" }), _jsxs(Button, { onClick: quiz.openQuiz, variant: "ghost", size: "sm", className: "w-full", children: [_jsx(Brain, { className: "w-4 h-4 mr-2" }), "Test Your Knowledge"] })] })] }) }))] })] }) }), _jsx(TabsContent, { value: "custom", className: "mt-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-12rem)]", children: [_jsxs("div", { className: "lg:col-span-2 lg:sticky lg:top-0 lg:h-full space-y-6", children: [_jsx(Card, { className: "h-auto", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg", children: "Custom Network Graph" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "outline", children: [nodes.length, " Nodes"] }), _jsxs(Badge, { variant: "outline", children: [edges.length, " Connections"] }), algorithmState && (_jsxs(Badge, { variant: "secondary", children: ["MST Cost: ", algorithmState.totalCost] }))] })] }), _jsx(EnhancedGraphVisualization, { nodes: nodes, edges: currentEdges, selectedNodes: selectedNodes, onNodeDrag: handleNodeDrag, onNodeClick: handleNodeClick, onNodesUpdate: handleNodesUpdate, width: 600, height: 400, isInteractive: true, layout: layout, onLayoutChange: handleLayoutChange }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx(Button, { onClick: handleStartAlgorithm, disabled: nodes.length < 2 || isRunning, variant: "default", children: "Start Algorithm" }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Info, { className: "w-4 h-4" }), "Click nodes to select, drag to move, use controls for layouts"] })] })] }) }), _jsx(Card, { className: "mb-4", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-2", children: [_jsx(HelpCircle, { className: "w-4 h-4" }), "About MST Algorithms"] }), _jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Both Kruskal's and Prim's algorithms find the minimum spanning tree, but use different approaches. Kruskal's sorts all edges globally, while Prim's grows the tree from a starting node. Build your own network and experiment with different layouts to better understand graph structure!" })] }) }) })] }), _jsxs("div", { className: "lg:overflow-y-auto lg:h-full lg:pr-2 space-y-4", children: [_jsx(UndoRedoControls, { onStateChange: handleUndoRedoStateChange }), _jsx(CityBuilder, { nodes: nodes, edges: edges, selectedNodes: selectedNodes, onAddNode: handleAddNode, onDeleteNode: handleDeleteNode, onAddEdge: handleAddEdge, onDeleteEdge: handleDeleteEdge, onGenerateRandom: handleGenerateRandom, onClearAll: handleClearAll, onNodeSelect: setSelectedNodes }), algorithmState && (_jsxs(_Fragment, { children: [_jsx(Separator, { className: "my-4" }), _jsx(AlgorithmController, { algorithmState: algorithmState, algorithmType: algorithmType, isRunning: isRunning, onStep: handleStep, onPlay: () => setIsRunning(true), onPause: () => setIsRunning(false), onReset: handleReset, onSpeedChange: setSpeed, onAlgorithmChange: handleAlgorithmChange, speed: speed })] }))] })] }) })] })] })] }));
}
