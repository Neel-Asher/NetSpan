# 🌐 Netspan

> **Visualize. Compare. Understand.**\
> An interactive platform to build graphs and explore Minimum Spanning Tree algorithms step by step.

---

## 🚀 Live Demo

🔗 **Deployed on Vercel:** [https://netspan.vercel.app/](https://netspan.vercel.app/)

---

## 📌 What is Netspan?

**Netspan** is an interactive, visualization‑driven web application designed to help users **build graphs**, **run classic graph algorithms**, and **understand how they work internally** through step‑by‑step execution and real‑time visuals.

The project focuses on **Minimum Spanning Tree (MST)** algorithms—specifically **Prim’s** and **Kruskal’s**—and allows users to:

- Visually see how each algorithm grows the MST
- Compare algorithm behavior and performance
- Learn algorithmic concepts through interaction rather than static code

Netspan is especially useful for **students**, **educators**, and **anyone learning graph theory or algorithms**.

---

## ✨ Key Features

### 🧩 Graph Construction

- Create custom graphs with nodes (cities) and weighted edges
- Interactive UI for adding, removing, and modifying graph elements

### 🔍 Algorithm Visualization

- Step‑by‑step execution of:
  - **Prim’s Algorithm**
  - **Kruskal’s Algorithm**
- Clear visual distinction between:
  - Selected edges
  - Candidate edges
  - Rejected edges

### ⚖️ Algorithm Comparison Mode

- Run Prim’s and Kruskal’s side‑by‑side
- Observe differences in edge selection and execution flow
- Compare total cost and performance metrics

### 📊 Performance Metrics

- Graph statistics and density analysis
- Execution insights for better algorithm understanding

### 🎨 Clean & Interactive UI

- Modern React UI with dynamic visual feedback
- Icon‑based controls and intuitive interactions

---

## 🛠️ Tech Stack

### Frontend

- **React** (with hooks)
- **TypeScript** (strict mode)
- **Vite** (fast dev & build tooling)

### Visualization & UI

- SVG‑based graph rendering
- **Lucide Icons**
- **Recharts** for metrics visualization

### Tooling & Deployment

- **TypeScript Project References**
- **ESBuild / Rollup (via Vite)**
- **Vercel** for production deployment

---

## 🧠 Algorithms Implemented

### 🔹 Prim’s Algorithm

- Grows the MST starting from a chosen node
- Always selects the minimum‑weight edge connecting the tree to a new node

### 🔹 Kruskal’s Algorithm

- Sorts all edges by weight
- Adds edges incrementally while avoiding cycles

Each algorithm is implemented with:

- Explicit internal state tracking
- Visualization‑friendly step execution
- Clear explanatory messages for each step

---

## 🧪 Why This Project Matters

This project goes beyond simply *implementing* algorithms:

- ✅ Focuses on **understanding**, not just results
- ✅ Demonstrates **real‑world frontend engineering practices**
- ✅ Uses **strict TypeScript** with production‑grade builds
- ✅ Designed for **learning, teaching, and demonstration**

It bridges the gap between **theoretical algorithms** and **interactive software systems**.

---

## 📦 Running Locally

```bash
# Clone the repository
git clone https://github.com/Neel-Asher/Netspan.git

# Navigate to project directory
cd netspan-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🌍 Deployment

The project is deployed using **Vercel**:

- Automatic builds on every push to `main`
- Optimized static asset delivery
- SPA routing support

---

## 📈 Future Improvements

- Support for additional graph algorithms (Dijkstra, BFS, DFS)
- Custom start node selection
- Larger graph performance optimization
- Export / import graph configurations
- Mobile responsiveness improvements

---

## 🧑‍💻 Author

**Neel Asher**\
B.Tech Computer Science and Engineering

---

## ⭐ Acknowledgements

- Graph theory & algorithm design concepts
- Open‑source libraries powering the ecosystem

---

> If you found this project useful or interesting, feel free to ⭐ the repository and share feedback!

