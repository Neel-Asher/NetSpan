import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { BarChart3, Network, Zap, Target, TrendingUp, Info } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';

interface GraphStatisticsProps {
  nodes: Node[];
  edges: Edge[];
  mstEdges?: Edge[];
  mstCost?: number;
}

export function GraphStatistics({ nodes, edges, mstEdges = [], mstCost = 0 }: GraphStatisticsProps) {
  // Basic graph metrics
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const maxPossibleEdges = nodeCount > 1 ? (nodeCount * (nodeCount - 1)) / 2 : 0;
  const density = maxPossibleEdges > 0 ? (edgeCount / maxPossibleEdges) * 100 : 0;
  
  // Degree statistics
  const degrees = new Map<string, number>();
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

  return (
    <div className="space-y-4">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4" />
            Graph Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-medium">{nodeCount}</div>
              <div className="text-xs text-muted-foreground">Nodes</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-medium">{edgeCount}</div>
              <div className="text-xs text-muted-foreground">Edges</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Density</span>
              <span>{density.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(density, 100)} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {edgeCount} of {maxPossibleEdges} possible connections
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="w-4 h-4" />
            Connectivity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Graph Status</span>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Components</span>
            <span className="text-sm font-medium">{components.length}</span>
          </div>
          
          {components.length > 1 && (
            <div className="text-xs text-muted-foreground">
              Largest component: {Math.max(...components.map(c => c.length))} nodes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Degree Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4" />
            Node Degrees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium">{minDegree}</div>
              <div className="text-muted-foreground">Min</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{avgDegree.toFixed(1)}</div>
              <div className="text-muted-foreground">Avg</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{maxDegree}</div>
              <div className="text-muted-foreground">Max</div>
            </div>
          </div>
          
          {topCentralNodes.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Most Central Nodes</div>
                <div className="space-y-1">
                  {topCentralNodes.map((node, index) => (
                    <div key={node.id} className="flex items-center justify-between text-xs">
                      <span>{node.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">deg: {node.degree}</span>
                        <div className="w-12 h-1 bg-muted rounded">
                          <div 
                            className="h-full bg-primary rounded" 
                            style={{ width: `${node.centrality}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edge Weight Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Edge Weights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium">{minWeight}</div>
              <div className="text-muted-foreground">Min</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{avgWeight.toFixed(1)}</div>
              <div className="text-muted-foreground">Avg</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{maxWeight}</div>
              <div className="text-muted-foreground">Max</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Total Weight</span>
            <span className="font-medium">{totalWeight}</span>
          </div>
        </CardContent>
      </Card>

      {/* MST Statistics */}
      {mstEdges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4" />
              MST Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{mstProgress.toFixed(0)}%</span>
              </div>
              <Progress value={mstProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {mstEdges.length} of {nodeCount - 1} edges needed
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>MST Cost</span>
                <span className="font-medium">{mstCost}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Original Cost</span>
                <span className="font-medium">{totalWeight}</span>
              </div>
              
              {costSaving > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span>Cost Saving</span>
                    <Badge variant="secondary">
                      {costSaving.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Saved {totalWeight - mstCost} units by using MST
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="w-3 h-3 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p><strong>Density:</strong> Higher density means more connections relative to maximum possible.</p>
              <p className="mt-1"><strong>Centrality:</strong> Nodes with higher degree are more connected and potentially more important.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to check if graph is connected
function checkConnectivity(nodes: Node[], edges: Edge[]): boolean {
  if (nodes.length <= 1) return true;
  
  const adjacencyList = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
    if (!adjacencyList.has(edge.target)) adjacencyList.set(edge.target, []);
    adjacencyList.get(edge.source)!.push(edge.target);
    adjacencyList.get(edge.target)!.push(edge.source);
  });
  
  const visited = new Set<string>();
  const stack = [nodes[0].id];
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
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
function findConnectedComponents(nodes: Node[], edges: Edge[]): string[][] {
  const adjacencyList = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
    if (!adjacencyList.has(edge.target)) adjacencyList.set(edge.target, []);
    adjacencyList.get(edge.source)!.push(edge.target);
    adjacencyList.get(edge.target)!.push(edge.source);
  });
  
  const visited = new Set<string>();
  const components: string[][] = [];
  
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const component: string[] = [];
      const stack = [node.id];
      
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;
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