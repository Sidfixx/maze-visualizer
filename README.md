# Pathfinding Visualizer

> Interactive pathfinding and maze generation visualizer built with React and TypeScript.

**🚀 [Live Demo](https://maze-visualizer-pi.vercel.app/)**


## 🚀 Features

- Visualize **BFS**, **DFS**, **Dijkstra's**, and **A\*** algorithms
- Draw and erase walls interactively
- Add weighted nodes using right-click
- Drag and reposition Start and End nodes
- Adjustable animation speed
- Detect and display when no path exists
- Generate mazes using:
  - Random Maze
  - Recursive Backtracking
  - Randomized Prim's Algorithm
- Compare all four pathfinding algorithms
- View:
  - Nodes visited
  - Path length
  - Execution time
- Built-in explanations of each algorithm
- Clean and responsive user interface

---

## 🧠 Algorithms

| Algorithm | Shortest Path | Weighted Nodes | Approach |
|-----------|---------------|----------------|----------|
| BFS | ✅ Yes | ❌ No | Breadth-first search |
| DFS | ❌ No | ❌ No | Depth-first search |
| Dijkstra | ✅ Yes | ✅ Yes | Minimum-cost search |
| A* | ✅ Yes* | ✅ Yes | Heuristic-guided search |

### BFS — Breadth-First Search

Explores nodes level by level using a queue.

For an unweighted grid, BFS guarantees the shortest path.

### DFS — Depth-First Search

Explores as deeply as possible before backtracking.

DFS can find a path, but does not guarantee the shortest path.

### Dijkstra's Algorithm

Explores the node with the smallest known distance.

It supports weighted nodes and guarantees the shortest path when weights are non-negative.

### A* Search

Combines the cost travelled so far with a heuristic estimate of the remaining distance.

This project uses Manhattan distance as the heuristic for the grid.

---

## 🧩 Maze Generation

The visualizer includes three maze generation algorithms.

### Random Maze

Randomly creates walls throughout the grid.

### Recursive Backtracking

Uses recursive backtracking to create a structured maze with corridors.

### Randomized Prim's Algorithm

Generates a maze using a randomized version of Prim's algorithm.

All maze generators preserve the Start and End nodes.

---

## 📊 Algorithm Comparison

The comparison mode runs:

```text
BFS
 ↓
DFS
 ↓
Dijkstra
 ↓
A*

## 🎮 How to Use

### Create Walls
Click and drag across the grid to create walls.
Drag over existing walls to erase them.

### Move Start and End
Drag the green Start node or red End node to reposition them.

### Add Weighted Nodes
Right-click an empty cell to toggle its weight.

Weighted nodes have a higher traversal cost and are considered by
Dijkstra's and A*.

### Visualize an Algorithm
Choose BFS, DFS, Dijkstra, or A* from the control panel.

### Generate a Maze
Use Random Maze, Recursive Backtracking, or Prim's Maze to generate
different maze structures.

### Compare Algorithms
Click **Compare Algorithms** to run BFS, DFS, Dijkstra, and A*
sequentially and compare their results.

### Reset
Click **Reset Visualizer** to clear walls, weights, paths, and
visited nodes while keeping the current Start and End positions.

🛠️ Tech Stack
React
TypeScript
Vite
CSS
Git & GitHub


🏗️ Project Structure
src/
├── algorithms/
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── dijkstra.ts
│   ├── astar.ts
│   ├── PriorityQueue.ts
│   └── mazeGeneration/
│       └── prims.ts
│
├── components/
│   ├── Grid/
│   ├── Controls/
│   ├── Stats/
│   ├── Comparison/
│   ├── AlgorithmInfo/
│   └── Legend/
│
├── hooks/
│   ├── useAlgorithmRunner.ts
│   ├── useAnimationPlayer.ts
│   └── useAlgorithmComparison.ts
│
├── mazes/
│   ├── randomMaze.ts
│   └── recursiveBacktracking.ts
│
├── types/
│   └── index.ts
│
├── utils/
│   └── gridUtils.ts
│
├── App.tsx
├── App.css
└── index.css


💻 Run Locally

Clone the repository and enter the project directory.

Install dependencies:

npm install

Start the development server:

npm run dev

Create a production build:

npm run build



📸 Screenshots
<img width="1918" height="958" alt="image" src="https://github.com/user-attachments/assets/2c22e261-b88b-4ea0-8a66-b41824b79236" />
<img width="1919" height="956" alt="image" src="https://github.com/user-attachments/assets/f4ff24e1-fa0a-4b8e-9954-1d59394ee906" />
<img width="1451" height="346" alt="image" src="https://github.com/user-attachments/assets/dbbff1fa-8807-4308-b0be-dbff6c4de317" />

🎯 Project Goals

This project was built to combine algorithmic concepts with an interactive user interface.

The main goals were to:

Understand pathfinding algorithms beyond theoretical implementation
Visualize how different algorithms explore a graph
Implement weighted and unweighted pathfinding
Implement maze generation algorithms
Compare algorithm behavior and performance
Practice React and TypeScript architecture


