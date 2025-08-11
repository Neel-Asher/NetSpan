import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Trash2, Plus, MapPin, Zap } from 'lucide-react';
import type { Node, Edge } from './KruskalAlgorithm';

interface CityBuilderProps {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  onAddNode: (node: Omit<Node, 'id'>) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddEdge: (edge: Omit<Edge, 'id' | 'status'>) => void;
  onDeleteEdge: (edgeId: string) => void;
  onGenerateRandom: () => void;
  onClearAll: () => void;
  onNodeSelect: (selectedNodes: string[]) => void;
}

export function CityBuilder({
  nodes,
  edges,
  selectedNodes,
  onAddNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
  onGenerateRandom,
  onClearAll,
  onNodeSelect
}: CityBuilderProps) {
  const [newCityName, setNewCityName] = React.useState('');
  const [edgeWeight, setEdgeWeight] = React.useState('');

  const handleAddCity = () => {
    if (!newCityName.trim()) return;
    
    const name = newCityName.trim();
    // Generate random position
    const x = Math.random() * 400 + 100;
    const y = Math.random() * 300 + 100;
    
    onAddNode({ name, x, y });
    setNewCityName('');
  };

  const handleNodeSelect = (nodeId: string) => {
    if (selectedNodes.includes(nodeId)) {
      onNodeSelect(selectedNodes.filter(id => id !== nodeId));
    } else if (selectedNodes.length < 2) {
      onNodeSelect([...selectedNodes, nodeId]);
    } else {
      onNodeSelect([nodeId]);
    }
  };

  const handleAddEdge = () => {
    if (selectedNodes.length !== 2 || !edgeWeight.trim()) return;
    
    const weight = parseInt(edgeWeight.trim());
    if (isNaN(weight) || weight <= 0) return;

    // Check if edge already exists
    const edgeExists = edges.some(edge => 
      (edge.source === selectedNodes[0] && edge.target === selectedNodes[1]) ||
      (edge.source === selectedNodes[1] && edge.target === selectedNodes[0])
    );

    if (edgeExists) return;

    onAddEdge({
      source: selectedNodes[0],
      target: selectedNodes[1],
      weight
    });

    onNodeSelect([]);
    setEdgeWeight('');
  };

  const getNodeName = (nodeId: string) => {
    return nodes.find(n => n.id === nodeId)?.name || nodeId;
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onGenerateRandom} variant="outline" size="sm">
              Generate Random
            </Button>
            <Button 
              onClick={onClearAll} 
              variant="outline" 
              size="sm"
              disabled={nodes.length === 0}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add City */}
      <Card>
        <CardHeader>
          <CardTitle>Add City</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="cityName">City Name</Label>
            <Input
              id="cityName"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="Enter city name..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
            />
          </div>
          <Button 
            onClick={handleAddCity} 
            disabled={!newCityName.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add City
          </Button>
        </CardContent>
      </Card>

      {/* Add Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Add Power Line
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Selected Cities</Label>
            <div className="text-sm text-muted-foreground">
              {selectedNodes.length === 0 && "Click cities in the graph to select them"}
              {selectedNodes.length === 1 && `${getNodeName(selectedNodes[0])} (select one more)`}
              {selectedNodes.length === 2 && `${getNodeName(selectedNodes[0])} ↔ ${getNodeName(selectedNodes[1])}`}
            </div>
          </div>

          {selectedNodes.length === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edgeWeight">Connection Cost</Label>
                <Input
                  id="edgeWeight"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                  placeholder="Enter cost..."
                  type="number"
                  min="1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEdge()}
                />
              </div>
              <Button 
                onClick={handleAddEdge}
                disabled={!edgeWeight.trim() || parseInt(edgeWeight) <= 0}
                className="w-full"
                size="sm"
              >
                Add Connection
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cities List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Cities ({nodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {nodes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cities added yet</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                    selectedNodes.includes(node.id) 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleNodeSelect(node.id)}
                >
                  <span className="text-sm">{node.name}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                      onNodeSelect(selectedNodes.filter(id => id !== node.id));
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connections List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Power Lines ({edges.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {edges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No connections added yet</p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {edges.map(edge => (
                <div
                  key={edge.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                >
                  <div className="text-sm">
                    <div>{getNodeName(edge.source)} ↔ {getNodeName(edge.target)}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Cost: {edge.weight}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => onDeleteEdge(edge.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}