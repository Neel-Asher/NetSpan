export class UnionFind {
    parent = new Map();
    rank = new Map();
    constructor(nodes) {
        nodes.forEach(node => {
            this.parent.set(node.id, node.id);
            this.rank.set(node.id, 0);
        });
    }
    find(x) {
        if (this.parent.get(x) !== x) {
            this.parent.set(x, this.find(this.parent.get(x)));
        }
        return this.parent.get(x);
    }
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY)
            return false;
        const rankX = this.rank.get(rootX);
        const rankY = this.rank.get(rootY);
        if (rankX < rankY) {
            this.parent.set(rootX, rootY);
        }
        else if (rankX > rankY) {
            this.parent.set(rootY, rootX);
        }
        else {
            this.parent.set(rootY, rootX);
            this.rank.set(rootX, rankX + 1);
        }
        return true;
    }
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    getComponents() {
        const components = new Map();
        this.parent.forEach((_, node) => {
            const root = this.find(node);
            if (!components.has(root)) {
                components.set(root, []);
            }
            components.get(root).push(node);
        });
        return components;
    }
}
export function initializeKruskalAlgorithm(nodes, edges) {
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    return {
        step: 0,
        totalSteps: sortedEdges.length,
        sortedEdges: sortedEdges.map(edge => ({ ...edge, status: 'pending' })),
        mstEdges: [],
        totalCost: 0,
        currentEdge: null,
        unionFind: new Map(),
        completed: false,
        explanation: 'Ready to start Kruskal\'s algorithm. We\'ll process edges in order of increasing weight.',
        currentStep: 0,
        startTime: 0
    };
}
export function executeKruskalStep(state, nodes) {
    if (state.completed || state.step >= state.totalSteps) {
        return state;
    }
    const unionFind = new UnionFind(nodes);
    const newMstEdges = [];
    let totalCost = 0;
    // Rebuild union-find state up to current step
    for (let i = 0; i < state.step; i++) {
        const edge = state.sortedEdges[i];
        if (edge.status === 'accepted') {
            unionFind.union(edge.source, edge.target);
            newMstEdges.push(edge);
            totalCost += edge.weight;
        }
    }
    const currentEdge = state.sortedEdges[state.step];
    const updatedEdges = [...state.sortedEdges];
    // Mark current edge as considering
    updatedEdges[state.step] = { ...currentEdge, status: 'considering' };
    let explanation = '';
    let newStatus = 'considering';
    if (unionFind.connected(currentEdge.source, currentEdge.target)) {
        newStatus = 'rejected';
        explanation = `Edge ${currentEdge.source}-${currentEdge.target} (weight: ${currentEdge.weight}) creates a cycle. Rejected.`;
    }
    else {
        newStatus = 'accepted';
        unionFind.union(currentEdge.source, currentEdge.target);
        newMstEdges.push({ ...currentEdge, status: 'accepted' });
        totalCost += currentEdge.weight;
        explanation = `Edge ${currentEdge.source}-${currentEdge.target} (weight: ${currentEdge.weight}) connects different components. Added to MST.`;
    }
    // Update the edge status
    updatedEdges[state.step] = { ...currentEdge, status: newStatus };
    const isCompleted = state.step + 1 >= state.totalSteps || newMstEdges.length >= nodes.length - 1;
    if (isCompleted) {
        explanation += ` Algorithm completed! MST has ${newMstEdges.length} edges with total cost ${totalCost}.`;
    }
    return {
        ...state,
        step: state.step + 1,
        sortedEdges: updatedEdges,
        mstEdges: newMstEdges,
        totalCost,
        currentEdge: { ...currentEdge, status: newStatus },
        completed: isCompleted,
        explanation
    };
}
