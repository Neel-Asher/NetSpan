import type { Node, Edge } from './KruskalAlgorithm';

export interface PrimState {
  step: number;
  totalSteps: number;
  completed: boolean;
  mstEdges: Edge[];
  totalCost: number;
  visitedNodes: Set<string>;
  candidateEdges: Edge[];
  currentEdge: Edge | null;
  explanation: string;
  startNode: string;
  currentStep: number;
  startTime: number;
}

export function initializePrimsAlgorithm(nodes: Node[], edges: Edge[]): PrimState {
  if (nodes.length === 0) {
    return {
      step: 0,
      totalSteps: 0,
      completed: true,
      mstEdges: [],
      totalCost: 0,
      visitedNodes: new Set(),
      candidateEdges: [],
      currentEdge: null,
      explanation: "No nodes to process",
      startNode: "",
      currentStep: 0,
      startTime: 0
    };
  }

  // Start with the first node
  const startNode = nodes[0].id;
  const visitedNodes = new Set<string>([startNode]);
  
  // Find all edges connected to the start node
  const candidateEdges = edges
    .filter(edge => edge.source === startNode || edge.target === startNode)
    .map(edge => ({ ...edge, status: 'pending' as const }))
    .sort((a, b) => a.weight - b.weight);

  return {
    step: 0,
    totalSteps: nodes.length - 1, // Need n-1 edges for spanning tree
    completed: false,
    mstEdges: [],
    totalCost: 0,
    visitedNodes,
    candidateEdges,
    currentEdge: candidateEdges[0] || null,
    explanation: `Starting Prim's algorithm from node ${nodes[0].name}. We begin by adding this node to our MST and considering all its adjacent edges.`,
    startNode,
    currentStep: 0,
    startTime: Date.now()
  };
}

export function executePrimStep(state: PrimState, nodes: Node[], edges: Edge[]): PrimState {
  if (state.completed || state.candidateEdges.length === 0) {
    return { ...state, completed: true };
  }

  // Find the minimum weight edge that connects to an unvisited node
  let selectedEdge: Edge | null = null;
  let selectedIndex = -1;

  for (let i = 0; i < state.candidateEdges.length; i++) {
    const edge = state.candidateEdges[i];
    const sourceVisited = state.visitedNodes.has(edge.source);
    const targetVisited = state.visitedNodes.has(edge.target);
    
    // Edge is valid if exactly one endpoint is visited
    if (sourceVisited !== targetVisited) {
      selectedEdge = edge;
      selectedIndex = i;
      break;
    }
  }

  if (!selectedEdge) {
    return {
      ...state,
      completed: true,
      explanation: "Algorithm completed. All nodes have been connected with minimum cost."
    };
  }

  // Add the new node to visited set
  const newNode = state.visitedNodes.has(selectedEdge.source) ? selectedEdge.target : selectedEdge.source;
  const newVisitedNodes = new Set(state.visitedNodes);
  newVisitedNodes.add(newNode);

  // Add selected edge to MST
  const newMstEdges = [...state.mstEdges, { ...selectedEdge, status: 'accepted' as const }];
  const newTotalCost = state.totalCost + selectedEdge.weight;

  // Remove the selected edge and invalid edges, then add new candidate edges
  let newCandidateEdges = state.candidateEdges.slice();
  newCandidateEdges.splice(selectedIndex, 1);

  // Remove edges that now connect two visited nodes (would create cycles)
  newCandidateEdges = newCandidateEdges.filter(edge => {
    const sourceVisited = newVisitedNodes.has(edge.source);
    const targetVisited = newVisitedNodes.has(edge.target);
    return sourceVisited !== targetVisited; // Keep only edges connecting visited to unvisited
  });

  // Add new edges from the newly added node
  const newEdges = edges
    .filter(edge => 
      (edge.source === newNode || edge.target === newNode) &&
      !newCandidateEdges.some(ce => ce.id === edge.id) &&
      !newMstEdges.some(me => me.id === edge.id)
    )
    .filter(edge => {
      const sourceVisited = newVisitedNodes.has(edge.source);
      const targetVisited = newVisitedNodes.has(edge.target);
      return sourceVisited !== targetVisited;
    })
    .map(edge => ({ ...edge, status: 'pending' as const }));

  newCandidateEdges = [...newCandidateEdges, ...newEdges].sort((a, b) => a.weight - b.weight);

  const nodeName = nodes.find(n => n.id === newNode)?.name || newNode;
  const currentNode = nodes.find(n => n.id === (state.visitedNodes.has(selectedEdge.source) ? selectedEdge.source : selectedEdge.target))?.name || '';

  const newStep = state.step + 1;
  const completed = newStep >= state.totalSteps || newCandidateEdges.length === 0;

  return {
    ...state,
    step: newStep,
    completed,
    mstEdges: newMstEdges,
    totalCost: newTotalCost,
    visitedNodes: newVisitedNodes,
    candidateEdges: newCandidateEdges,
    currentEdge: newCandidateEdges[0] || null,
    explanation: completed 
      ? `Algorithm completed! We've connected all nodes with total cost ${newTotalCost}. Prim's algorithm builds the MST by always choosing the minimum weight edge that connects the growing tree to a new node.`
      : `Added edge from ${currentNode} to ${nodeName} (weight: ${selectedEdge.weight}). This was the minimum weight edge connecting our current tree to an unvisited node. Total cost so far: ${newTotalCost}.`
  };
}

export function getPrimEdgesForVisualization(state: PrimState, allEdges: Edge[]): Edge[] {
  return allEdges.map(edge => {
    // Check if this edge is in MST
    const inMST = state.mstEdges.some(mstEdge => mstEdge.id === edge.id);
    if (inMST) {
      return { ...edge, status: 'accepted' as const };
    }

    // Check if this edge is currently being considered
    if (state.currentEdge && state.currentEdge.id === edge.id) {
      return { ...edge, status: 'considering' as const };
    }

    // Check if this edge is a candidate
    const isCandidate = state.candidateEdges.some(candidate => candidate.id === edge.id);
    if (isCandidate) {
      const sourceVisited = state.visitedNodes.has(edge.source);
      const targetVisited = state.visitedNodes.has(edge.target);
      // Only highlight as candidate if it connects visited to unvisited
      if (sourceVisited !== targetVisited) {
        return { ...edge, status: 'pending' as const };
      }
    }

    return { ...edge, status: 'pending' as const };
  });
}