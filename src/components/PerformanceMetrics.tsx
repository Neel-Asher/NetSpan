import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Activity, TrendingUp, Clock, Zap, Target, AlertTriangle } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';

interface PerformanceMetric {
  nodes: number;
  edges: number;
  kruskalSteps: number;
  primSteps: number;
  kruskalTime: number;
  primTime: number;
  theoreticalKruskal: number;
  theoreticalPrim: number;
}

interface PerformanceMetricsProps {
  currentNodes: Node[];
  currentEdges: Edge[];
  recentExecutions?: {
    algorithm: 'kruskal' | 'prim';
    steps: number;
    time: number;
    nodes: number;
    edges: number;
  }[];
}

// Time complexity calculations
const calculateTheoreticalComplexity = (nodes: number, edges: number, algorithm: 'kruskal' | 'prim') => {
  if (algorithm === 'kruskal') {
    // O(E log E) - dominated by sorting edges
    return edges * Math.log2(edges);
  } else {
    // O(V²) for simple implementation, O(E log V) with binary heap
    // Using O(E log V) as it's more common in practice
    return edges * Math.log2(nodes);
  }
};

// Generate performance data for different graph sizes
const generatePerformanceData = (): PerformanceMetric[] => {
  const data: PerformanceMetric[] = [];
  
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

export function PerformanceMetrics({ currentNodes, currentEdges, recentExecutions = [] }: PerformanceMetricsProps) {
  const [viewMode, setViewMode] = React.useState<'complexity' | 'comparison' | 'real-time'>('complexity');
  const [complexityType, setComplexityType] = React.useState<'steps' | 'time' | 'theoretical'>('steps');

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
    const { nodes: _nodes, edges: _edges, density } = currentMetrics;

    
    if (density < 30) {
      return {
        algorithm: 'Prim',
        reason: 'Sparse graph - Prim\'s algorithm is more efficient for graphs with fewer edges relative to vertices.',
        confidence: 'High'
      };
    } else if (density > 70) {
      return {
        algorithm: 'Kruskal',
        reason: 'Dense graph - Kruskal\'s algorithm handles dense graphs well due to efficient edge sorting.',
        confidence: 'Medium'
      };
    } else {
      return {
        algorithm: 'Either',
        reason: 'Medium density graph - both algorithms will perform similarly. Consider other factors like implementation complexity.',
        confidence: 'Medium'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Current Graph Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            Current Graph Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-medium">{currentMetrics.nodes}</div>
              <div className="text-xs text-muted-foreground">Nodes</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-medium">{currentMetrics.edges}</div>
              <div className="text-xs text-muted-foreground">Edges</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-medium">{currentMetrics.density.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Density</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-medium">{currentMetrics.efficiency}</div>
              <div className="text-xs text-muted-foreground">Predicted Winner</div>
            </div>
          </div>

          {/* Complexity Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Kruskal's Complexity</span>
                <span>{currentMetrics.kruskalComplexity} operations</span>
              </div>
              <Progress 
                value={Math.min((currentMetrics.kruskalComplexity / Math.max(currentMetrics.kruskalComplexity, currentMetrics.primComplexity)) * 100, 100)} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prim's Complexity</span>
                <span>{currentMetrics.primComplexity} operations</span>
              </div>
              <Progress 
                value={Math.min((currentMetrics.primComplexity / Math.max(currentMetrics.kruskalComplexity, currentMetrics.primComplexity)) * 100, 100)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4" />
            Algorithm Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant={recommendation.algorithm === 'Either' ? 'secondary' : 'default'}
              className="text-sm"
            >
              Recommended: {recommendation.algorithm}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                recommendation.confidence === 'High' ? 'text-green-600 border-green-300' : 
                recommendation.confidence === 'Medium' ? 'text-orange-600 border-orange-300' : 
                'text-red-600 border-red-300'
              }`}
            >
              {recommendation.confidence} Confidence
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {recommendation.reason}
          </p>

          <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-800">
              <strong>Note:</strong> Recommendations are based on theoretical complexity. 
              Actual performance may vary based on implementation details and data characteristics.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="complexity">Complexity Comparison</TabsTrigger>
              <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
              <TabsTrigger value="real-time">Real-time Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="complexity" className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Metric Type:</label>
                <Select value={complexityType} onValueChange={(value: any) => setComplexityType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steps">Algorithm Steps</SelectItem>
                    <SelectItem value="time">Execution Time</SelectItem>
                    <SelectItem value="theoretical">Theoretical Complexity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nodes" label={{ value: 'Number of Nodes', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(getChartData()[0] || {}).filter(key => key !== 'nodes').map((key, index) => (
                      <Line 
                        key={key}
                        type="monotone" 
                        dataKey={key} 
                        stroke={index === 0 ? '#3b82f6' : '#10b981'} 
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DATA.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nodes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="kruskalSteps" fill="#3b82f6" name="Kruskal Steps" />
                    <Bar dataKey="primSteps" fill="#10b981" name="Prim Steps" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="real-time" className="space-y-4">
              {recentExecutions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Executions</h4>
                  {recentExecutions.slice(-5).map((execution, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {execution.algorithm}
                        </Badge>
                        <span className="text-sm">
                          {execution.nodes} nodes, {execution.edges} edges
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span>{execution.steps} steps</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {execution.time}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent executions to display</p>
                  <p className="text-sm">Run some algorithms to see real-time performance metrics</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Complexity Cheat Sheet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4" />
            Algorithm Complexity Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Kruskal's Algorithm</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>Time: O(E log E)</div>
                  <div>Space: O(V)</div>
                  <div>Best for: Sparse graphs</div>
                  <div>Key operation: Sort all edges</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Prim's Algorithm</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>Time: O(E log V)</div>
                  <div>Space: O(V)</div>
                  <div>Best for: Dense graphs</div>
                  <div>Key operation: Priority queue operations</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              <div className="font-medium mb-1">Legend:</div>
              <div>V = Number of vertices (nodes), E = Number of edges</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}