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
import { type Node, type Edge, type AlgorithmState, initializeKruskalAlgorithm, executeKruskalStep } from './KruskalAlgorithm';
import { type PrimState, initializePrimsAlgorithm, executePrimStep, getPrimEdgesForVisualization } from './PrimsAlgorithm';
import type { AlgorithmType } from './AlgorithmController';

interface AlgorithmInstance {
  type: AlgorithmType;
  state: AlgorithmState | PrimState | null;
  isRunning: boolean;
  stepCount: number;
  executionTime: number;
  startTime: number;
}

interface ComparisonModeProps {
  nodes: Node[];
  edges: Edge[];
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
  onNodeClick: (nodeId: string) => void;
  selectedNodes: string[];
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function ComparisonMode({ 
  nodes, 
  edges, 
  onNodeDrag, 
  onNodeClick, 
  selectedNodes,
  speed,
  onSpeedChange
}: ComparisonModeProps) {
  const [algorithms, setAlgorithms] = React.useState<{
    left: AlgorithmInstance;
    right: AlgorithmInstance;
  }>({
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

  const [syncMode, setSyncMode] = React.useState<'synchronized' | 'independent'>('synchronized');
  const [comparisonResults, setComparisonResults] = React.useState<{
    winner: 'left' | 'right' | 'tie' | null;
    metrics: {
      steps: { left: number; right: number };
      time: { left: number; right: number };
      efficiency: { left: number; right: number };
    };
  } | null>(null);

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
    } else {
      // Independent mode - handle each algorithm separately
      const timers: NodeJS.Timeout[] = [];
      
      if (algorithms.left.isRunning && !algorithms.left.state?.completed) {
        timers.push(setTimeout(() => executeStep('left'), speed));
      }
      
      if (algorithms.right.isRunning && !algorithms.right.state?.completed) {
        timers.push(setTimeout(() => executeStep('right'), speed));
      }
      
      return () => timers.forEach(clearTimeout);
    }
  }, [algorithms, speed, syncMode]);

  const initializeAlgorithm = (side: 'left' | 'right', algorithmType: AlgorithmType) => {
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

  const executeStep = (target: 'left' | 'right' | 'both') => {
    setAlgorithms(prev => {
      const newAlgorithms = { ...prev };
      
      const executeForSide = (side: 'left' | 'right') => {
        if (!newAlgorithms[side].state || newAlgorithms[side].state.completed) return;
        
        let newState: AlgorithmState | PrimState;
        
        if (newAlgorithms[side].type === 'kruskal') {
          newState = executeKruskalStep(newAlgorithms[side].state as AlgorithmState, nodes);
        } else {
          newState = executePrimStep(newAlgorithms[side].state as PrimState, nodes, edges);
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
    if (!algorithms.left.state || !algorithms.right.state) return;
    
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
      
      let winner: 'left' | 'right' | 'tie' = 'tie';
      if (algorithms.left.stepCount < algorithms.right.stepCount) winner = 'left';
      else if (algorithms.right.stepCount < algorithms.left.stepCount) winner = 'right';
      
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

  const getEdgesForVisualization = (side: 'left' | 'right') => {
    const algorithm = algorithms[side];
    if (!algorithm.state) return edges;
    
    if (algorithm.type === 'prim') {
      return getPrimEdgesForVisualization(algorithm.state as PrimState, edges);
    } else {
      return (algorithm.state as AlgorithmState).sortedEdges;
    }
  };

  const getProgress = (side: 'left' | 'right') => {
    const algorithm = algorithms[side];
    if (!algorithm.state) return 0;
    
    const totalSteps = nodes.length - 1; // MST has n-1 edges
    return Math.min((algorithm.state.mstEdges.length / totalSteps) * 100, 100);
  };

  const canStart = algorithms.left.state && algorithms.right.state && 
                   !algorithms.left.state.completed && !algorithms.right.state.completed;
  const isRunning = algorithms.left.isRunning || algorithms.right.isRunning;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="w-4 h-4" />
            Algorithm Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Algorithm Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Left Algorithm</label>
              <Select 
                value={algorithms.left.type} 
                onValueChange={(value: AlgorithmType) => initializeAlgorithm('left', value)}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
                  <SelectItem value="prim">Prim's Algorithm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Right Algorithm</label>
              <Select 
                value={algorithms.right.type} 
                onValueChange={(value: AlgorithmType) => initializeAlgorithm('right', value)}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
                  <SelectItem value="prim">Prim's Algorithm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sync Mode */}
          <div>
            <label className="text-sm font-medium">Execution Mode</label>
            <Select 
              value={syncMode} 
              onValueChange={(value: 'synchronized' | 'independent') => setSyncMode(value)}
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="synchronized">Synchronized (Step Together)</SelectItem>
                <SelectItem value="independent">Independent (Run Separately)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={startAlgorithms}
              disabled={!canStart || isRunning}
              size="sm"
            >
              <Play className="w-3 h-3 mr-1" />
              Start Both
            </Button>
            
            <Button
              onClick={pauseAlgorithms}
              disabled={!isRunning}
              variant="outline"
              size="sm"
            >
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </Button>
            
            <Button
              onClick={resetAlgorithms}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>

            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2 text-sm">
              <Timer className="w-3 h-3" />
              <span>Speed:</span>
              <Select value={speed.toString()} onValueChange={(value) => onSpeedChange(parseInt(value))}>
                <SelectTrigger className="w-20 h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">0.5x</SelectItem>
                  <SelectItem value="1000">1x</SelectItem>
                  <SelectItem value="500">2x</SelectItem>
                  <SelectItem value="250">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Initialize Buttons */}
          {(!algorithms.left.state || !algorithms.right.state) && (
            <div className="flex gap-2">
              {!algorithms.left.state && (
                <Button
                  onClick={() => initializeAlgorithm('left', algorithms.left.type)}
                  variant="outline"
                  size="sm"
                >
                  Initialize {algorithms.left.type === 'kruskal' ? "Kruskal's" : "Prim's"} (Left)
                </Button>
              )}
              {!algorithms.right.state && (
                <Button
                  onClick={() => initializeAlgorithm('right', algorithms.right.type)}
                  variant="outline"
                  size="sm"
                >
                  Initialize {algorithms.right.type === 'kruskal' ? "Kruskal's" : "Prim's"} (Right)
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="w-4 h-4" />
              Comparison Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {comparisonResults.winner === 'tie' ? (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  It's a Tie! Both algorithms performed equally well
                </Badge>
              ) : (
                <Badge variant="default" className="text-lg px-4 py-2">
                  {comparisonResults.winner === 'left' 
                    ? `${algorithms.left.type === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Wins!`
                    : `${algorithms.right.type === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Wins!`
                  }
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Steps Taken</div>
                <div className="flex justify-between mt-1">
                  <span>Left: {comparisonResults.metrics.steps.left}</span>
                  <span>Right: {comparisonResults.metrics.steps.right}</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-medium">Execution Time</div>
                <div className="flex justify-between mt-1">
                  <span>Left: {comparisonResults.metrics.time.left}ms</span>
                  <span>Right: {comparisonResults.metrics.time.right}ms</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-medium">Final MST Cost</div>
                <div className="flex justify-between mt-1">
                  <span>Left: {algorithms.left.state?.totalCost}</span>
                  <span>Right: {algorithms.right.state?.totalCost}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>{algorithms.left.type === 'kruskal' ? "Kruskal's Algorithm" : "Prim's Algorithm"}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {algorithms.left.type}
                </Badge>
                {algorithms.left.state && (
                  <Badge variant="secondary">
                    Cost: {algorithms.left.state.totalCost}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {algorithms.left.state && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getProgress('left').toFixed(0)}%</span>
                  </div>
                  <Progress value={getProgress('left')} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Steps: {algorithms.left.stepCount}</span>
                    <span>Time: {algorithms.left.executionTime}ms</span>
                  </div>
                </div>
                
                <EnhancedGraphVisualization
                  nodes={nodes}
                  edges={getEdgesForVisualization('left')}
                  selectedNodes={selectedNodes}
                  onNodeDrag={onNodeDrag}
                  onNodeClick={onNodeClick}
                  width={400}
                  height={300}
                  isInteractive={false}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>{algorithms.right.type === 'kruskal' ? "Kruskal's Algorithm" : "Prim's Algorithm"}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {algorithms.right.type}
                </Badge>
                {algorithms.right.state && (
                  <Badge variant="secondary">
                    Cost: {algorithms.right.state.totalCost}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {algorithms.right.state && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getProgress('right').toFixed(0)}%</span>
                  </div>
                  <Progress value={getProgress('right')} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Steps: {algorithms.right.stepCount}</span>
                    <span>Time: {algorithms.right.executionTime}ms</span>
                  </div>
                </div>
                
                <EnhancedGraphVisualization
                  nodes={nodes}
                  edges={getEdgesForVisualization('right')}
                  selectedNodes={selectedNodes}
                  onNodeDrag={onNodeDrag}
                  onNodeClick={onNodeClick}
                  width={400}
                  height={300}
                  isInteractive={false}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}