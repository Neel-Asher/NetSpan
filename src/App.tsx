import React from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Toaster } from "./components/ui/sonner";
import {
  Info,
  Menu,
  HelpCircle,
  Brain,
  Download,
  Upload,
  BookOpen,
  BarChart3,
  GitCompare,
  Network,
  Activity,
  History,
} from "lucide-react";
import { EnhancedGraphVisualization } from "./components/EnhancedGraphVisualization";
import { GraphStatistics } from "./components/GraphStatistics";
import {
  AlgorithmController,
  type AlgorithmType,
} from "./components/AlgorithmController";
import { CityBuilder } from "./components/CityBuilder";
import { ThemeToggle } from "./components/ThemeToggle";
import { Tutorial, useTutorial } from "./components/Tutorial";
import { Quiz, useQuiz } from "./components/Quiz";
import { ImportExport } from "./components/ImportExport";
import {
  UndoRedoControls,
  useUndoRedoKeyboards,
  type GraphState,
} from "./components/UndoRedo";
import { GraphTemplates } from "./components/GraphTemplates";
import { ComparisonMode } from "./components/ComparisonMode";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import type { LayoutType } from "./components/GraphLayouts";
import {
  type Node,
  type Edge,
  type AlgorithmState,
  initializeKruskalAlgorithm,
  executeKruskalStep,
} from "./components/KruskalAlgorithm";
import {
  type PrimState,
  initializePrimsAlgorithm,
  executePrimStep,
  getPrimEdgesForVisualization,
} from "./components/PrimsAlgorithm";

const logoImage = "/images/logo-transparent.png";

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

function generateRandomGraph(numNodes: number = 6): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

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

  const edgeSet = new Set<string>();
  let edgeId = 0;

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
  const [mode, setMode] = React.useState<
    | "random"
    | "custom"
    | "import"
    | "statistics"
    | "comparison"
    | "templates"
    | "performance"
  >("random");
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [algorithmState, setAlgorithmState] = React.useState<
    AlgorithmState | PrimState | null
  >(null);
  const [algorithmType, setAlgorithmType] =
    React.useState<AlgorithmType>("kruskal");
  const [isRunning, setIsRunning] = React.useState(false);
  const [speed, setSpeed] = React.useState(1000);
  const [nodeIdCounter, setNodeIdCounter] = React.useState(0);
  const [edgeIdCounter, setEdgeIdCounter] = React.useState(0);
  const [selectedNodes, setSelectedNodes] = React.useState<string[]>([]);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [layout, setLayout] = React.useState<LayoutType>("manual");

  const [executionHistory, setExecutionHistory] = React.useState<
    Array<{
      algorithm: "kruskal" | "prim";
      steps: number;
      time: number;
      nodes: number;
      edges: number;
    }>
  >([]);

  const tutorial = useTutorial();
  const quiz = useQuiz();

  const dummyUndo = React.useCallback(() => {}, []);

  const dummyRedo = React.useCallback(() => {}, []);

  useUndoRedoKeyboards(dummyUndo, dummyRedo, false, false);

  const handleUndoRedoStateChange = React.useCallback((state: GraphState) => {
    setNodes(state.nodes);
    setEdges(state.edges);
    setNodeIdCounter(state.nodeIdCounter);
    setEdgeIdCounter(state.edgeIdCounter);
    setAlgorithmState(null);
    setIsRunning(false);
    setSelectedNodes([]);
  }, []);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("netspan-theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("netspan-theme", newTheme);
  }, [theme]);

  React.useEffect(() => {
    const { nodes: randomNodes, edges: randomEdges } = generateRandomGraph();
    setNodes(randomNodes);
    setEdges(randomEdges);
    setNodeIdCounter(randomNodes.length);
    setEdgeIdCounter(randomEdges.length);
  }, []);

  React.useEffect(() => {
    if (!isRunning || !algorithmState || algorithmState.completed) return;

    const timer = setTimeout(() => {
      handleStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, algorithmState, speed]);

  const handleModeChange = React.useCallback(
    (
      newMode:
        | "random"
        | "custom"
        | "import"
        | "statistics"
        | "comparison"
        | "templates"
        | "performance"
    ) => {
      setMode(newMode);
      setIsRunning(false);
      setAlgorithmState(null);
      setSelectedNodes([]);

      if (newMode === "random") {
        const { nodes: randomNodes, edges: randomEdges } =
          generateRandomGraph();
        setNodes(randomNodes);
        setEdges(randomEdges);
        setNodeIdCounter(randomNodes.length);
        setEdgeIdCounter(randomEdges.length);
      }
    },
    []
  );

  const handleStartAlgorithm = React.useCallback(() => {
    if (nodes.length < 2) return;

    let newAlgorithmState: AlgorithmState | PrimState;

    if (algorithmType === "kruskal") {
      newAlgorithmState = initializeKruskalAlgorithm(nodes, edges);
    } else {
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
    if (!algorithmState) return;

    let newState: AlgorithmState | PrimState;

    if (algorithmType === "kruskal") {
      newState = executeKruskalStep(algorithmState as AlgorithmState, nodes);
    } else {
      newState = executePrimStep(algorithmState as PrimState, nodes, edges);
    }

    setAlgorithmState(newState);

    if (newState.completed) {
      setIsRunning(false);

      const execution = {
        algorithm: algorithmType,
        steps:
          algorithmType === "kruskal"
            ? (newState as AlgorithmState).currentStep
            : (newState as PrimState).currentStep,
        time:
          Date.now() -
          (algorithmType === "kruskal"
            ? (algorithmState as AlgorithmState).startTime
            : (algorithmState as PrimState).startTime),
        nodes: nodes.length,
        edges: edges.length,
      };

      setExecutionHistory((prev) => [...prev.slice(-9), execution]); 
    }
  }, [algorithmState, algorithmType, nodes, edges]);

  const handleReset = React.useCallback(() => {
    setIsRunning(false);
    setAlgorithmState(null);
  }, []);

  const handleAlgorithmChange = React.useCallback(
    (newType: AlgorithmType) => {
      if (newType !== algorithmType) {
        setAlgorithmType(newType);
        setAlgorithmState(null);
        setIsRunning(false);
      }
    },
    [algorithmType]
  );

  const handleNodeDrag = React.useCallback(
    (nodeId: string, x: number, y: number) => {
      setNodes((prev) =>
        prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node))
      );
    },
    []
  );

  const handleNodeClick = React.useCallback(
    (nodeId: string) => {
      if (mode !== "custom") return;

      setSelectedNodes((prev) => {
        if (prev.includes(nodeId)) {
          return prev.filter((id) => id !== nodeId);
        } else if (prev.length < 2) {
          return [...prev, nodeId];
        } else {
          return [nodeId];
        }
      });
    },
    [mode]
  );

  const handleAddNode = React.useCallback(
    (nodeData: Omit<Node, "id">) => {
      const newNode: Node = {
        id: `node-${nodeIdCounter}`,
        ...nodeData,
      };
      setNodes((prev) => [...prev, newNode]);
      setNodeIdCounter((prev) => prev + 1);
    },
    [nodeIdCounter]
  );

  const handleDeleteNode = React.useCallback(
    (nodeId: string) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      const newEdges = edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodes((prev) => prev.filter((id) => id !== nodeId));
    },
    [nodes, edges]
  );

  const handleAddEdge = React.useCallback(
    (edgeData: Omit<Edge, "id" | "status">) => {
      const newEdge: Edge = {
        id: `edge-${edgeIdCounter}`,
        status: "pending",
        ...edgeData,
      };
      setEdges((prev) => [...prev, newEdge]);
      setEdgeIdCounter((prev) => prev + 1);
    },
    [edgeIdCounter]
  );

  const handleDeleteEdge = React.useCallback(
    (edgeId: string) => {
      const newEdges = edges.filter((edge) => edge.id !== edgeId);
      setEdges(newEdges);
    },
    [edges]
  );

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

  const handleImport = React.useCallback(
    (
      importedNodes: Node[],
      importedEdges: Edge[],
      nodeCounter: number,
      edgeCounter: number
    ) => {
      setNodes(importedNodes);
      setEdges(importedEdges);
      setNodeIdCounter(nodeCounter);
      setEdgeIdCounter(edgeCounter);
      setAlgorithmState(null);
      setIsRunning(false);
      setSelectedNodes([]);

      setTimeout(() => {
        setMode("custom");
      }, 100);
    },
    []
  );

  const handleApplyTemplate = React.useCallback(
    (
      templateNodes: Node[],
      templateEdges: Edge[],
      nodeCounter: number,
      edgeCounter: number
    ) => {
      setNodes(templateNodes);
      setEdges(templateEdges);
      setNodeIdCounter(nodeCounter);
      setEdgeIdCounter(edgeCounter);
      setAlgorithmState(null);
      setIsRunning(false);
      setSelectedNodes([]);

      setTimeout(() => {
        setMode("custom");
      }, 100);
    },
    []
  );

  const handleNodesUpdate = React.useCallback((updatedNodes: Node[]) => {
    setNodes(updatedNodes);
  }, []);

  const handleLayoutChange = React.useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
  }, []);

  const getCurrentEdges = React.useCallback(() => {
    if (!algorithmState) return edges;

    if (algorithmType === "prim") {
      return getPrimEdgesForVisualization(algorithmState as PrimState, edges);
    } else {
      return (algorithmState as AlgorithmState).sortedEdges;
    }
  }, [algorithmState, algorithmType, edges]);

  const currentEdges = getCurrentEdges();

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {/* Toast Notifications */}
      <Toaster />

      {/* Top Navigation */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <Menu className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={tutorial.openTutorial}>
              <BookOpen className="w-4 h-4 mr-2" />
              Tutorial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={quiz.openQuiz}>
              <Brain className="w-4 h-4 mr-2" />
              Take Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("import")}>
              <Upload className="w-4 h-4 mr-2" />
              Import/Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("statistics")}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Graph Statistics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("comparison")}>
              <GitCompare className="w-4 h-4 mr-2" />
              Algorithm Comparison
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("templates")}>
              <Network className="w-4 h-4 mr-2" />
              Graph Templates
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("performance")}>
              <Activity className="w-4 h-4 mr-2" />
              Performance Analysis
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {/* Tutorial and Quiz Components */}
      <Tutorial isOpen={tutorial.isOpen} onClose={tutorial.closeTutorial} />
      <Quiz isOpen={quiz.isOpen} onClose={quiz.closeQuiz} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <h1 className="netspan-brand text-4xl">NetSpan</h1>
          </div>
          <p className="text-muted-foreground netspan-subtitle">
            Interactive visualization of Minimum Spanning Tree algorithms for
            network optimization
          </p>
        </div>

        {/* Mode Selector */}
        <Tabs
          value={mode}
          onValueChange={(value) =>
            handleModeChange(
              value as
                | "random"
                | "custom"
                | "import"
                | "statistics"
                | "comparison"
                | "templates"
                | "performance"
            )
          }
        >
          <TabsList className="grid w-full grid-cols-7 max-w-4xl mx-auto">
            <TabsTrigger value="random">Random</TabsTrigger>
            <TabsTrigger value="custom">Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="statistics">Stats</TabsTrigger>
          </TabsList>

          {/* Import/Export Tab */}
          <TabsContent value="import" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <ImportExport
                      nodes={nodes}
                      edges={edges}
                      onImport={handleImport}
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <Download className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Import and export your network graphs
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Current graph: {nodes.length} nodes, {edges.length}{" "}
                        edges
                      </div>
                      <Button
                        onClick={() => setMode("custom")}
                        variant="outline"
                        className="w-full"
                      >
                        Edit in Custom Builder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <GraphStatistics
                      nodes={nodes}
                      edges={edges}
                      mstEdges={algorithmState?.mstEdges || []}
                      mstCost={algorithmState?.totalCost || 0}
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Detailed graph analysis and metrics
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Analyzing graph with {nodes.length} nodes and{" "}
                        {edges.length} edges
                      </div>
                      <Button
                        onClick={() => setMode("custom")}
                        variant="outline"
                        className="w-full"
                      >
                        Edit Graph Structure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GraphTemplates onApplyTemplate={handleApplyTemplate} />
              </div>
              <div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Network className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Pre-built network topologies for learning and testing
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Choose from basic, special, or real-world graph
                        templates
                      </div>
                      <Button
                        onClick={() => setMode("custom")}
                        variant="outline"
                        className="w-full"
                      >
                        Edit in Builder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="mt-6">
            <ComparisonMode
              nodes={nodes}
              edges={edges}
              onNodeDrag={handleNodeDrag}
              onNodeClick={handleNodeClick}
              selectedNodes={selectedNodes}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <PerformanceMetrics
              currentNodes={nodes}
              currentEdges={edges}
              recentExecutions={executionHistory}
            />
          </TabsContent>

          {/* Random Simulation Tab */}
          <TabsContent value="random" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graph Visualization */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg">Network Graph</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{nodes.length} Nodes</Badge>
                        <Badge variant="outline">
                          {edges.length} Connections
                        </Badge>
                        {algorithmState && (
                          <Badge variant="secondary">
                            MST Cost: {algorithmState.totalCost}
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {algorithmType}
                        </Badge>
                      </div>
                    </div>

                    <EnhancedGraphVisualization
                      nodes={nodes}
                      edges={currentEdges}
                      selectedNodes={selectedNodes}
                      onNodeDrag={handleNodeDrag}
                      onNodeClick={handleNodeClick}
                      onNodesUpdate={handleNodesUpdate}
                      width={600}
                      height={400}
                      isInteractive={false}
                      layout={layout}
                      onLayoutChange={handleLayoutChange}
                    />

                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        onClick={handleStartAlgorithm}
                        disabled={nodes.length < 2 || isRunning}
                        variant="default"
                      >
                        Start{" "}
                        {algorithmType === "kruskal" ? "Kruskal's" : "Prim's"}{" "}
                        Algorithm
                      </Button>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="w-4 h-4" />
                        Use the eye icon to customize visualization
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Algorithm Comparison Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        About MST Algorithms
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Both Kruskal's and Prim's algorithms find the minimum
                        spanning tree, but use different approaches. Kruskal's
                        sorts all edges globally, while Prim's grows the tree
                        from a starting node. Try different layouts to better
                        understand graph structure!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                {algorithmState && (
                  <AlgorithmController
                    algorithmState={algorithmState}
                    algorithmType={algorithmType}
                    isRunning={isRunning}
                    onStep={handleStep}
                    onPlay={() => setIsRunning(true)}
                    onPause={() => setIsRunning(false)}
                    onReset={handleReset}
                    onSpeedChange={setSpeed}
                    onAlgorithmChange={handleAlgorithmChange}
                    speed={speed}
                  />
                )}

                {!algorithmState && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <img
                        src={logoImage}
                        alt="NetSpan Logo"
                        className="w-12 h-12 mx-auto mb-4 opacity-60"
                      />
                      <p className="text-muted-foreground mb-4">
                        Ready to optimize the network!
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={handleGenerateRandom}
                          variant="outline"
                          className="w-full"
                        >
                          Generate New Random Graph
                        </Button>
                        <Button
                          onClick={quiz.openQuiz}
                          variant="ghost"
                          size="sm"
                          className="w-full"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Test Your Knowledge
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Custom Builder Tab */}
          <TabsContent value="custom" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-12rem)]">
              {/* Fixed Graph Visualization with About Section */}
              <div className="lg:col-span-2 lg:sticky lg:top-0 lg:h-full space-y-6">
                <Card className="h-auto">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg">Custom Network Graph</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{nodes.length} Nodes</Badge>
                        <Badge variant="outline">
                          {edges.length} Connections
                        </Badge>
                        {algorithmState && (
                          <Badge variant="secondary">
                            MST Cost: {algorithmState.totalCost}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <EnhancedGraphVisualization
                      nodes={nodes}
                      edges={currentEdges}
                      selectedNodes={selectedNodes}
                      onNodeDrag={handleNodeDrag}
                      onNodeClick={handleNodeClick}
                      onNodesUpdate={handleNodesUpdate}
                      width={600}
                      height={400}
                      isInteractive={true}
                      layout={layout}
                      onLayoutChange={handleLayoutChange}
                    />

                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        onClick={handleStartAlgorithm}
                        disabled={nodes.length < 2 || isRunning}
                        variant="default"
                      >
                        Start Algorithm
                      </Button>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="w-4 h-4" />
                        Click nodes to select, drag to move, use controls for
                        layouts
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Algorithm Comparison Info */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        About MST Algorithms
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Both Kruskal's and Prim's algorithms find the minimum
                        spanning tree, but use different approaches. Kruskal's
                        sorts all edges globally, while Prim's grows the tree
                        from a starting node. Build your own network and
                        experiment with different layouts to better understand
                        graph structure!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Scrollable Side Panel */}
              <div className="lg:overflow-y-auto lg:h-full lg:pr-2 space-y-4">
                {/* Undo/Redo Controls */}
                <UndoRedoControls onStateChange={handleUndoRedoStateChange} />

                <CityBuilder
                  nodes={nodes}
                  edges={edges}
                  selectedNodes={selectedNodes}
                  onAddNode={handleAddNode}
                  onDeleteNode={handleDeleteNode}
                  onAddEdge={handleAddEdge}
                  onDeleteEdge={handleDeleteEdge}
                  onGenerateRandom={handleGenerateRandom}
                  onClearAll={handleClearAll}
                  onNodeSelect={setSelectedNodes}
                />

                {algorithmState && (
                  <>
                    <Separator className="my-4" />
                    <AlgorithmController
                      algorithmState={algorithmState}
                      algorithmType={algorithmType}
                      isRunning={isRunning}
                      onStep={handleStep}
                      onPlay={() => setIsRunning(true)}
                      onPause={() => setIsRunning(false)}
                      onReset={handleReset}
                      onSpeedChange={setSpeed}
                      onAlgorithmChange={handleAlgorithmChange}
                      speed={speed}
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
