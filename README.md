# Pathfinding Visualizer

> Interactive pathfinding and maze generation visualizer built with React and TypeScript.

**🚀 [Live Demo](https://maze-visualizer-pi.vercel.app/)**

---

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
