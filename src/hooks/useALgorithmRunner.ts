import { useState } from 'react';
import type { Node, AlgorithmResult } from '../types';
import { bfs } from '../algorithms/bfs';
import { reconstructPath } from '../algorithms/bfs';
import { cloneGrid, resetGridState } from '../utils/gridUtils';

export function useAlgorithmRunner() {
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  function runBFS(grid: Node[][], startNode: Node, endNode: Node) {
    setIsRunning(true);

    // Clone the grid so BFS doesn't mutate the original
    const clonedGrid = cloneGrid(grid);
    const clonedStart = clonedGrid[startNode.row][startNode.col];
    const clonedEnd = clonedGrid[endNode.row][endNode.col];

    // Run BFS
    const visitedNodesInOrder = bfs(clonedGrid, clonedStart, clonedEnd);

    // Reconstruct path
    const shortestPath = reconstructPath(clonedEnd);

    setResult({ visitedNodesInOrder, shortestPath });
    setIsRunning(false);
  }

  function reset(grid: Node[][]) {
    resetGridState(grid);
    setResult(null);
  }

  return { result, isRunning, runBFS, reset };
}