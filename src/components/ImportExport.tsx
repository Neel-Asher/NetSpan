import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Download, Upload, Folder, AlertCircle } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';
import { toast } from 'sonner';

export interface GraphData {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    created: string;
    version: string;
    nodeCount: number;
    edgeCount: number;
  };
}

// Predefined scenarios for educational purposes
const PREDEFINED_SCENARIOS: GraphData[] = [
  {
    name: "Simple Network",
    description: "A basic 4-node network perfect for understanding MST concepts",
    nodes: [
      { id: "node-0", name: "A", x: 150, y: 150 },
      { id: "node-1", name: "B", x: 450, y: 150 },
      { id: "node-2", name: "C", x: 150, y: 350 },
      { id: "node-3", name: "D", x: 450, y: 350 }
    ],
    edges: [
      { id: "edge-0", source: "node-0", target: "node-1", weight: 10, status: "pending" },
      { id: "edge-1", source: "node-0", target: "node-2", weight: 15, status: "pending" },
      { id: "edge-2", source: "node-1", target: "node-3", weight: 12, status: "pending" },
      { id: "edge-3", source: "node-2", target: "node-3", weight: 8, status: "pending" },
      { id: "edge-4", source: "node-0", target: "node-3", weight: 25, status: "pending" },
      { id: "edge-5", source: "node-1", target: "node-2", weight: 20, status: "pending" }
    ],
    metadata: {
      created: "2024-01-01",
      version: "1.0",
      nodeCount: 4,
      edgeCount: 6
    }
  },
  {
    name: "City Power Grid",
    description: "A realistic city power grid scenario with 6 cities and varying connection costs",
    nodes: [
      { id: "node-0", name: "Metro", x: 300, y: 100 },
      { id: "node-1", name: "North", x: 200, y: 200 },
      { id: "node-2", name: "East", x: 500, y: 200 },
      { id: "node-3", name: "West", x: 100, y: 350 },
      { id: "node-4", name: "South", x: 300, y: 400 },
      { id: "node-5", name: "Port", x: 450, y: 350 }
    ],
    edges: [
      { id: "edge-0", source: "node-0", target: "node-1", weight: 15, status: "pending" },
      { id: "edge-1", source: "node-0", target: "node-2", weight: 18, status: "pending" },
      { id: "edge-2", source: "node-1", target: "node-3", weight: 22, status: "pending" },
      { id: "edge-3", source: "node-1", target: "node-4", weight: 28, status: "pending" },
      { id: "edge-4", source: "node-2", target: "node-5", weight: 12, status: "pending" },
      { id: "edge-5", source: "node-3", target: "node-4", weight: 30, status: "pending" },
      { id: "edge-6", source: "node-4", target: "node-5", weight: 25, status: "pending" },
      { id: "edge-7", source: "node-0", target: "node-4", weight: 35, status: "pending" },
      { id: "edge-8", source: "node-2", target: "node-4", weight: 20, status: "pending" }
    ],
    metadata: {
      created: "2024-01-01",
      version: "1.0",
      nodeCount: 6,
      edgeCount: 9
    }
  },
  {
    name: "Dense Network",
    description: "A densely connected 5-node network showcasing algorithm efficiency",
    nodes: [
      { id: "node-0", name: "Hub", x: 300, y: 200 },
      { id: "node-1", name: "N1", x: 200, y: 100 },
      { id: "node-2", name: "N2", x: 400, y: 100 },
      { id: "node-3", name: "N3", x: 150, y: 300 },
      { id: "node-4", name: "N4", x: 450, y: 300 }
    ],
    edges: [
      { id: "edge-0", source: "node-0", target: "node-1", weight: 8, status: "pending" },
      { id: "edge-1", source: "node-0", target: "node-2", weight: 12, status: "pending" },
      { id: "edge-2", source: "node-0", target: "node-3", weight: 15, status: "pending" },
      { id: "edge-3", source: "node-0", target: "node-4", weight: 10, status: "pending" },
      { id: "edge-4", source: "node-1", target: "node-2", weight: 25, status: "pending" },
      { id: "edge-5", source: "node-1", target: "node-3", weight: 18, status: "pending" },
      { id: "edge-6", source: "node-2", target: "node-4", weight: 14, status: "pending" },
      { id: "edge-7", source: "node-3", target: "node-4", weight: 22, status: "pending" },
      { id: "edge-8", source: "node-1", target: "node-4", weight: 30, status: "pending" },
      { id: "edge-9", source: "node-2", target: "node-3", weight: 28, status: "pending" }
    ],
    metadata: {
      created: "2024-01-01",
      version: "1.0",
      nodeCount: 5,
      edgeCount: 10
    }
  }
];

interface ImportExportProps {
  nodes: Node[];
  edges: Edge[];
  onImport: (nodes: Node[], edges: Edge[], nodeIdCounter: number, edgeIdCounter: number) => void;
}

export function ImportExport({ nodes, edges, onImport }: ImportExportProps) {
  const [exportName, setExportName] = React.useState('');
  const [exportDescription, setExportDescription] = React.useState('');
  const [importData, setImportData] = React.useState('');

  const handleExport = () => {
    if (!exportName.trim()) {
      toast.error('Please enter a name for the export');
      return;
    }

    const graphData: GraphData = {
      name: exportName.trim(),
      description: exportDescription.trim() || 'Custom network graph',
      nodes: nodes.map(node => ({ ...node })), // Deep copy
      edges: edges.map(edge => ({ ...edge, status: 'pending' })), // Reset edge status
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        nodeCount: nodes.length,
        edgeCount: edges.length
      }
    };

    const jsonString = JSON.stringify(graphData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Graph exported as ${a.download}`);
    setExportName('');
    setExportDescription('');
  };

  const handleImportFromText = () => {
    if (!importData.trim()) {
      toast.error('Please paste graph data to import');
      return;
    }

    try {
      const graphData: GraphData = JSON.parse(importData.trim());
      
      if (!graphData.nodes || !graphData.edges) {
        toast.error('Invalid graph data format');
        return;
      }

      // Validate and sanitize data
      const validNodes = graphData.nodes.filter(node => 
        node.id && node.name && typeof node.x === 'number' && typeof node.y === 'number'
      );

      const validEdges = graphData.edges.filter(edge =>
        edge.id && edge.source && edge.target && typeof edge.weight === 'number' &&
        validNodes.some(n => n.id === edge.source) &&
        validNodes.some(n => n.id === edge.target)
      ).map(edge => ({ ...edge, status: 'pending' as const }));

      if (validNodes.length === 0) {
        toast.error('No valid nodes found in import data');
        return;
      }

      // Calculate counters for new nodes/edges
      const maxNodeId = Math.max(...validNodes.map(n => parseInt(n.id.replace('node-', '')) || 0), -1);
      const maxEdgeId = Math.max(...validEdges.map(e => parseInt(e.id.replace('edge-', '')) || 0), -1);

      onImport(validNodes, validEdges, maxNodeId + 1, maxEdgeId + 1);
      setImportData('');
      toast.success(`Imported ${graphData.name || 'graph'} successfully`);
    } catch (error) {
      toast.error('Failed to parse graph data. Please check the format.');
    }
  };

  const handleImportScenario = (scenario: GraphData) => {
    const maxNodeId = Math.max(...scenario.nodes.map(n => parseInt(n.id.replace('node-', '')) || 0), -1);
    const maxEdgeId = Math.max(...scenario.edges.map(e => parseInt(e.id.replace('edge-', '')) || 0), -1);
    
    onImport(scenario.nodes, scenario.edges, maxNodeId + 1, maxEdgeId + 1);
    toast.success(`Loaded ${scenario.name} scenario`);
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Graph
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exportName">Graph Name *</Label>
            <Input
              id="exportName"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              placeholder="My Custom Network"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exportDescription">Description (Optional)</Label>
            <Textarea
              id="exportDescription"
              value={exportDescription}
              onChange={(e) => setExportDescription(e.target.value)}
              placeholder="Describe your network graph..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{nodes.length} nodes, {edges.length} connections</span>
          </div>

          <Button 
            onClick={handleExport}
            disabled={nodes.length === 0 || !exportName.trim()}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as JSON
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Graph
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importData">Paste Graph Data</Label>
            <Textarea
              id="importData"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON graph data here..."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleImportFromText}
            disabled={!importData.trim()}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import from Text
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Predefined Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Load Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose from educational scenarios designed to demonstrate different MST concepts
          </p>
          
          {PREDEFINED_SCENARIOS.map((scenario) => (
            <Card key={scenario.name} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{scenario.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {scenario.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {scenario.metadata.nodeCount} nodes • {scenario.metadata.edgeCount} connections
                  </div>
                </div>
                <Button
                  onClick={() => handleImportScenario(scenario)}
                  variant="outline"
                  size="sm"
                >
                  Load
                </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p><strong>Export:</strong> Save your current graph as a JSON file for later use or sharing.</p>
              <p className="mt-1"><strong>Import:</strong> Load a previously saved graph or paste JSON data directly.</p>
              <p className="mt-1"><strong>Scenarios:</strong> Pre-built educational examples to explore different network topologies.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}