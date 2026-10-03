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

## 📊 Project Metrics

> All figures below were measured directly from this repository (`main`, Node 22-class sandbox, Vite 7.3). Timings are approximate and will vary by machine.

### 🧮 Codebase at a Glance

| Metric | Value |
| --- | --- |
| Commits on `main` | 31 |
| Hand-written TypeScript/TSX files (excl. UI primitives) | 18 |
| Hand-written TypeScript/TSX lines (excl. UI primitives) | ~5,700 |
| Reusable UI primitives (shadcn/Radix) | 48 files, ~5,100 lines |
| Total TypeScript/TSX | 66 files, ~10,800 lines |
| Feature components | 16 |
| Largest module (`App.tsx`) | ~1,040 lines |
| Language split (GitHub) | TypeScript 68.9% · JavaScript 30.1% · Other 1.0% |
| Runtime / dev dependencies | 51 / 16 |
| TypeScript compile (`tsc -b`) | 0 errors |
| License | MIT |

### 🎛️ Feature Coverage

| Feature | Count |
| --- | --- |
| MST algorithms implemented | 2 (Prim's, Kruskal's) |
| Edge states visualized | 4 (pending · considering · accepted · rejected) |
| Graph layouts | 5 (manual, circular, force-directed, hierarchical, grid) |
| Preset graph templates | 7 across 3 categories (3 basic · 2 special · 2 real-world) |
| Metrics views | 3 (complexity, comparison, real-time) |
| Interactive quiz | 6 questions (2 easy · 3 medium · 1 hard) |
| Guided tutorial | 7 steps |
| Undo / redo history | Up to 50 states |
| Graph import / export | JSON |
| Themes | Light and dark |

### ⚡ Build & Bundle Size

| Asset | Raw | Gzipped |
| --- | --- | --- |
| JavaScript bundle | 803.9 kB | 242.8 kB |
| CSS | 82.9 kB | 13.8 kB |
| `index.html` | 0.5 kB | 0.3 kB |
| **Total** | **~887 kB** | **~257 kB** |

- Production build time: **~7.5 s** (2,562 modules transformed)
- Output: a single JS chunk — code-splitting (e.g. lazy-loading the Quiz, Tutorial and Metrics panels) is a natural next optimization

### ⏱️ Algorithm Performance (Measured)

Measured by running NetSpan's own step-by-step `Prim` and `Kruskal` executors end-to-end on seeded random connected graphs (integer weights 1–100), averaged over 3–20 runs:

| Nodes (V) | Edges (E) | Kruskal | Prim | Kruskal steps | Prim steps |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10 | 22 | 0.18 ms | 0.24 ms | 13 | 9 |
| 25 | 90 | 0.35 ms | 0.39 ms | 32 | 24 |
| 50 | 245 | 1.91 ms | 1.17 ms | 130 | 49 |
| 100 | 495 | 4.76 ms | 4.78 ms | 222 | 99 |
| 200 | 995 | 27.92 ms | 15.76 ms | 556 | 199 |
| 500 | 2,495 | 256.07 ms | 93.97 ms | 1,914 | 499 |

**Takeaways**

- Graphs of up to ~100 nodes complete a full run in **under 5 ms**, so the visualization is never bottlenecked by the algorithm itself.
- **Prim's always takes exactly V − 1 steps**, while **Kruskal's takes between V − 1 and E steps**, since it stops early once the MST is complete (e.g. 222 of 495 edges examined at V = 100).
- The step-by-step executors recompute state on every step to drive the visualization, so end-to-end times grow faster than the textbook bounds below as graphs get large.

**Theoretical complexity (as shown in the in-app panel)**

| Algorithm | Time | Space |
| --- | --- | --- |
| Kruskal's | O(E log E) | O(V) |
| Prim's | O(E log V) | O(V) |

### ✅ Correctness Check

- **500 / 500** randomly generated connected graphs (3–30 nodes, 10%–90% edge density) produced **identical MST total cost** from Prim's and Kruskal's, with exactly **V − 1 edges** in each tree.

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
