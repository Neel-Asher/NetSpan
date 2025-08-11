import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Network, Star, GitBranch, Grid3X3, Hexagon, Triangle, Circle, Zap } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';

export interface GraphTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'special' | 'real-world';
  nodes: Node[];
  edges: Edge[];
  icon: React.ReactNode;
  complexity: 'Simple' | 'Medium' | 'Complex';
  useCase: string;
}

interface GraphTemplatesProps {
  onApplyTemplate: (nodes: Node[], edges: Edge[], nodeCounter: number, edgeCounter: number) => void;
  onTemplateInfo?: (template: GraphTemplate) => void;
}

// Template generation functions
function createStarGraph(centerName: string = 'Hub', numSpokes: number = 5): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Center node
  nodes.push({
    id: 'node-0',
    name: centerName,
    x: 300,
    y: 200
  });
  
  // Spoke nodes
  for (let i = 1; i <= numSpokes; i++) {
    const angle = ((i - 1) / numSpokes) * 2 * Math.PI;
    const radius = 120;
    
    nodes.push({
      id: `node-${i}`,
      name: `Node ${i}`,
      x: 300 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    });
    
    // Connect to center
    edges.push({
      id: `edge-${i - 1}`,
      source: 'node-0',
      target: `node-${i}`,
      weight: Math.floor(Math.random() * 20) + 5,
      status: 'pending'
    });
  }
  
  return { nodes, edges };
}

function createCompleteGraph(numNodes: number = 4): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create nodes in a circle
  for (let i = 0; i < numNodes; i++) {
    const angle = (i / numNodes) * 2 * Math.PI;
    const radius = 100;
    
    nodes.push({
      id: `node-${i}`,
      name: `N${i + 1}`,
      x: 300 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    });
  }
  
  // Connect every node to every other node
  let edgeId = 0;
  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      edges.push({
        id: `edge-${edgeId++}`,
        source: `node-${i}`,
        target: `node-${j}`,
        weight: Math.floor(Math.random() * 30) + 10,
        status: 'pending'
      });
    }
  }
  
  return { nodes, edges };
}

function createLinearChain(numNodes: number = 5): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const spacing = 500 / (numNodes - 1);
  
  // Create nodes in a line
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      id: `node-${i}`,
      name: `Node ${i + 1}`,
      x: 50 + i * spacing,
      y: 200
    });
    
    // Connect to next node
    if (i < numNodes - 1) {
      edges.push({
        id: `edge-${i}`,
        source: `node-${i}`,
        target: `node-${i + 1}`,
        weight: Math.floor(Math.random() * 25) + 8,
        status: 'pending'
      });
    }
  }
  
  return { nodes, edges };
}

function createBinaryTree(levels: number = 3): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let nodeId = 0;
  let edgeId = 0;
  
  // Create nodes level by level
  for (let level = 0; level < levels; level++) {
    const nodesInLevel = Math.pow(2, level);
    const levelWidth = 400;
    const spacing = levelWidth / (nodesInLevel + 1);
    const y = 100 + level * 80;
    
    for (let i = 0; i < nodesInLevel; i++) {
      const x = 100 + (i + 1) * spacing;
      
      nodes.push({
        id: `node-${nodeId}`,
        name: `L${level}N${i + 1}`,
        x,
        y
      });
      
      // Connect to parent (if not root)
      if (level > 0) {
        const parentId = Math.floor((nodeId - 1) / 2);
        edges.push({
          id: `edge-${edgeId++}`,
          source: `node-${parentId}`,
          target: `node-${nodeId}`,
          weight: Math.floor(Math.random() * 20) + 5,
          status: 'pending'
        });
      }
      
      nodeId++;
    }
  }
  
  return { nodes, edges };
}

function createGridGraph(rows: number = 3, cols: number = 3): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const cellWidth = 400 / cols;
  const cellHeight = 300 / rows;
  let nodeId = 0;
  let edgeId = 0;
  
  // Create nodes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      nodes.push({
        id: `node-${nodeId}`,
        name: `${row + 1},${col + 1}`,
        x: 100 + col * cellWidth + cellWidth / 2,
        y: 100 + row * cellHeight + cellHeight / 2
      });
      nodeId++;
    }
  }
  
  // Create edges (horizontal and vertical connections)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const currentId = row * cols + col;
      
      // Horizontal edge (right)
      if (col < cols - 1) {
        edges.push({
          id: `edge-${edgeId++}`,
          source: `node-${currentId}`,
          target: `node-${currentId + 1}`,
          weight: Math.floor(Math.random() * 15) + 5,
          status: 'pending'
        });
      }
      
      // Vertical edge (down)
      if (row < rows - 1) {
        edges.push({
          id: `edge-${edgeId++}`,
          source: `node-${currentId}`,
          target: `node-${currentId + cols}`,
          weight: Math.floor(Math.random() * 15) + 5,
          status: 'pending'
        });
      }
    }
  }
  
  return { nodes, edges };
}

// Predefined templates
const GRAPH_TEMPLATES: GraphTemplate[] = [
  {
    id: 'star-5',
    name: 'Star Network',
    description: 'Central hub connected to 5 nodes - common in client-server architectures',
    category: 'basic',
    ...createStarGraph('Hub', 5),
    icon: <Star className="w-4 h-4" />,
    complexity: 'Simple',
    useCase: 'Client-Server, Network Hubs'
  },
  {
    id: 'complete-4',
    name: 'Complete Graph',
    description: 'Every node connected to every other node - fully meshed network',
    category: 'basic',
    ...createCompleteGraph(4),
    icon: <Circle className="w-4 h-4" />,
    complexity: 'Medium',
    useCase: 'Redundant Networks, Peer-to-Peer'
  },
  {
    id: 'linear-chain',
    name: 'Linear Chain',
    description: 'Nodes connected in a straight line - simple pipeline topology',
    category: 'basic',
    ...createLinearChain(5),
    icon: <GitBranch className="w-4 h-4" />,
    complexity: 'Simple',
    useCase: 'Assembly Lines, Data Pipelines'
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    description: 'Hierarchical tree structure with binary branching',
    category: 'special',
    ...createBinaryTree(3),
    icon: <Triangle className="w-4 h-4" />,
    complexity: 'Medium',
    useCase: 'Organizational Charts, Decision Trees'
  },
  {
    id: 'grid-3x3',
    name: 'Grid Network',
    description: '3x3 grid with nearest neighbor connections',
    category: 'special',
    ...createGridGraph(3, 3),
    icon: <Grid3X3 className="w-4 h-4" />,
    complexity: 'Medium',
    useCase: 'Mesh Networks, City Streets'
  },
  {
    id: 'ring-network',
    name: 'Ring Network',
    description: 'Nodes connected in a circular topology with redundant paths',
    category: 'real-world',
    nodes: [
      { id: 'node-0', name: 'A', x: 300, y: 120 },
      { id: 'node-1', name: 'B', x: 380, y: 160 },
      { id: 'node-2', name: 'C', x: 380, y: 240 },
      { id: 'node-3', name: 'D', x: 300, y: 280 },
      { id: 'node-4', name: 'E', x: 220, y: 240 },
      { id: 'node-5', name: 'F', x: 220, y: 160 }
    ],
    edges: [
      { id: 'edge-0', source: 'node-0', target: 'node-1', weight: 15, status: 'pending' },
      { id: 'edge-1', source: 'node-1', target: 'node-2', weight: 12, status: 'pending' },
      { id: 'edge-2', source: 'node-2', target: 'node-3', weight: 18, status: 'pending' },
      { id: 'edge-3', source: 'node-3', target: 'node-4', weight: 14, status: 'pending' },
      { id: 'edge-4', source: 'node-4', target: 'node-5', weight: 16, status: 'pending' },
      { id: 'edge-5', source: 'node-5', target: 'node-0', weight: 13, status: 'pending' }
    ],
    icon: <Hexagon className="w-4 h-4" />,
    complexity: 'Simple',
    useCase: 'Token Ring, Backup Networks'
  },
  {
    id: 'power-grid',
    name: 'Power Grid',
    description: 'Realistic power distribution network with redundancy',
    category: 'real-world',
    nodes: [
      { id: 'node-0', name: 'Plant', x: 300, y: 100 },
      { id: 'node-1', name: 'Sub1', x: 200, y: 180 },
      { id: 'node-2', name: 'Sub2', x: 400, y: 180 },
      { id: 'node-3', name: 'City1', x: 150, y: 280 },
      { id: 'node-4', name: 'City2', x: 300, y: 280 },
      { id: 'node-5', name: 'City3', x: 450, y: 280 },
      { id: 'node-6', name: 'Backup', x: 300, y: 350 }
    ],
    edges: [
      { id: 'edge-0', source: 'node-0', target: 'node-1', weight: 25, status: 'pending' },
      { id: 'edge-1', source: 'node-0', target: 'node-2', weight: 30, status: 'pending' },
      { id: 'edge-2', source: 'node-1', target: 'node-3', weight: 15, status: 'pending' },
      { id: 'edge-3', source: 'node-1', target: 'node-4', weight: 20, status: 'pending' },
      { id: 'edge-4', source: 'node-2', target: 'node-4', weight: 18, status: 'pending' },
      { id: 'edge-5', source: 'node-2', target: 'node-5', weight: 22, status: 'pending' },
      { id: 'edge-6', source: 'node-4', target: 'node-6', weight: 12, status: 'pending' },
      { id: 'edge-7', source: 'node-3', target: 'node-4', weight: 35, status: 'pending' },
      { id: 'edge-8', source: 'node-4', target: 'node-5', weight: 28, status: 'pending' }
    ],
    icon: <Zap className="w-4 h-4" />,
    complexity: 'Complex',
    useCase: 'Power Distribution, Infrastructure'
  }
];

export function GraphTemplates({ onApplyTemplate, onTemplateInfo }: GraphTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'basic' | 'special' | 'real-world'>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? GRAPH_TEMPLATES 
    : GRAPH_TEMPLATES.filter(template => template.category === selectedCategory);

  const handleApplyTemplate = (template: GraphTemplate) => {
    // Calculate max IDs for counters
    const maxNodeId = Math.max(...template.nodes.map(n => parseInt(n.id.replace('node-', '')) || 0), -1);
    const maxEdgeId = Math.max(...template.edges.map(e => parseInt(e.id.replace('edge-', '')) || 0), -1);
    
    onApplyTemplate(template.nodes, template.edges, maxNodeId + 1, maxEdgeId + 1);
    
    if (onTemplateInfo) {
      onTemplateInfo(template);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Complex': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="w-4 h-4" />
          Graph Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {(['all', 'basic', 'special', 'real-world'] as const).map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {category === 'all' ? 'All' : category.replace('-', ' ')}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Templates List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {template.icon}
                    <div>
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.nodes.length} nodes • {template.edges.length} edges
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getComplexityColor(template.complexity)}`}
                    >
                      {template.complexity}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {template.description}
                </div>
                
                <div className="text-xs">
                  <span className="font-medium">Use Case: </span>
                  <span className="text-muted-foreground">{template.useCase}</span>
                </div>
                
                <Button
                  onClick={() => handleApplyTemplate(template)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Apply Template
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No templates found for this category
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <div className="font-medium mb-1">Template Categories:</div>
          <div><strong>Basic:</strong> Fundamental network topologies</div>
          <div><strong>Special:</strong> Mathematical graph structures</div>
          <div><strong>Real-world:</strong> Practical network scenarios</div>
        </div>
      </CardContent>
    </Card>
  );
}

export { GRAPH_TEMPLATES };