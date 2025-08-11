import type { Node, Edge } from './KruskalAlgorithm';

export type LayoutType = 'manual' | 'circular' | 'force-directed' | 'hierarchical' | 'grid';

export interface LayoutOptions {
  width: number;
  height: number;
  padding?: number;
}

// Force-directed layout using simple physics simulation
export function applyForceDirectedLayout(
  nodes: Node[], 
  edges: Edge[], 
  options: LayoutOptions,
  iterations: number = 100
): Node[] {
  const { width, height, padding = 50 } = options;
  
  // Create a copy of nodes to avoid mutation
  let layoutNodes = nodes.map(node => ({
    ...node,
    vx: 0,
    vy: 0,
    fx: undefined,
    fy: undefined
  }));

  // If nodes don't have positions, initialize them randomly
  layoutNodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) {
      node.x = padding + Math.random() * (width - 2 * padding);
      node.y = padding + Math.random() * (height - 2 * padding);
    }
  });

  const k = Math.sqrt((width * height) / nodes.length) * 0.5; // Spring constant
  const repulsionForce = k * k;
  
  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion forces between all nodes
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i];
        const nodeB = layoutNodes[j];
        
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = repulsionForce / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        nodeA.vx = (nodeA.vx || 0) + fx;
        nodeA.vy = (nodeA.vy || 0) + fy;
        nodeB.vx = (nodeB.vx || 0) - fx;
        nodeB.vy = (nodeB.vy || 0) - fy;
      }
    }
    
    // Attraction forces along edges
    edges.forEach(edge => {
      const nodeA = layoutNodes.find(n => n.id === edge.source);
      const nodeB = layoutNodes.find(n => n.id === edge.target);
      
      if (!nodeA || !nodeB) return;
      
      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      const force = (distance - k) * 0.1;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      nodeA.vx = (nodeA.vx || 0) + fx;
      nodeA.vy = (nodeA.vy || 0) + fy;
      nodeB.vx = (nodeB.vx || 0) - fx;
      nodeB.vy = (nodeB.vy || 0) - fy;
    });
    
    // Apply forces and damping
    layoutNodes.forEach(node => {
      node.vx = (node.vx || 0) * 0.85; // Damping
      node.vy = (node.vy || 0) * 0.85;
      
      node.x += node.vx || 0;
      node.y += node.vy || 0;
      
      // Boundary constraints
      node.x = Math.max(padding, Math.min(width - padding, node.x));
      node.y = Math.max(padding, Math.min(height - padding, node.y));
    });
  }
  
  return layoutNodes;
}

// Circular layout arranging nodes in a circle
export function applyCircularLayout(nodes: Node[], options: LayoutOptions): Node[] {
  const { width, height, padding = 50 } = options;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - padding;
  
  return nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
}

// Hierarchical layout using simple level-based positioning
export function applyHierarchicalLayout(nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] {
  const { width, height, padding = 50 } = options;
  
  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Map<string, number>();
  edges.forEach(edge => {
    incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
  });
  
  const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));
  if (rootNodes.length === 0) {
    // No clear hierarchy, use first node as root
    return applyCircularLayout(nodes, options);
  }
  
  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  });
  
  // Assign levels using BFS
  const levels = new Map<string, number>();
  const queue: Array<{ nodeId: string; level: number }> = [];
  
  rootNodes.forEach(root => {
    levels.set(root.id, 0);
    queue.push({ nodeId: root.id, level: 0 });
  });
  
  let maxLevel = 0;
  while (queue.length > 0) {
    const { nodeId, level } = queue.shift()!;
    maxLevel = Math.max(maxLevel, level);
    
    const children = adjacencyList.get(nodeId) || [];
    children.forEach(childId => {
      if (!levels.has(childId)) {
        levels.set(childId, level + 1);
        queue.push({ nodeId: childId, level: level + 1 });
      }
    });
  }
  
  // Group nodes by level
  const nodesByLevel = new Map<number, Node[]>();
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });
  
  // Position nodes
  const levelHeight = (height - 2 * padding) / (maxLevel || 1);
  
  return nodes.map(node => {
    const level = levels.get(node.id) || 0;
    const nodesAtLevel = nodesByLevel.get(level) || [];
    const indexAtLevel = nodesAtLevel.indexOf(node);
    const levelWidth = width - 2 * padding;
    
    const x = nodesAtLevel.length > 1 
      ? padding + (indexAtLevel / (nodesAtLevel.length - 1)) * levelWidth
      : width / 2;
    const y = padding + level * levelHeight;
    
    return { ...node, x, y };
  });
}

// Grid layout arranging nodes in a regular grid
export function applyGridLayout(nodes: Node[], options: LayoutOptions): Node[] {
  const { width, height, padding = 50 } = options;
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);
  
  const cellWidth = (width - 2 * padding) / cols;
  const cellHeight = (height - 2 * padding) / rows;
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return {
      ...node,
      x: padding + col * cellWidth + cellWidth / 2,
      y: padding + row * cellHeight + cellHeight / 2
    };
  });
}

// Apply layout based on type
export function applyLayout(
  nodes: Node[], 
  edges: Edge[], 
  layoutType: LayoutType, 
  options: LayoutOptions
): Node[] {
  switch (layoutType) {
    case 'circular':
      return applyCircularLayout(nodes, options);
    case 'force-directed':
      return applyForceDirectedLayout(nodes, edges, options, 150);
    case 'hierarchical':
      return applyHierarchicalLayout(nodes, edges, options);
    case 'grid':
      return applyGridLayout(nodes, options);
    case 'manual':
    default:
      return nodes; // Keep existing positions
  }
}