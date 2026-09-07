import { useState } from 'react';
import type { Node, AlgorithmResult } from '../types';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { reconstructPath } from '../algorithms/bfs';
import { cloneGrid, resetGridState } from '../utils/gridUtils';

export function useAlgorithmRunner() {
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  function runAlgorithm(
    algorithm: (grid: Node[][], start: Node, end: Node) => Node[],
    grid: Node[][],
    startNode: Node,
    endNode: Node
  ) {
    setIsRunning(true);

    const clonedGrid = cloneGrid(grid);
    const clonedStart = clonedGrid[startNode.row][startNode.col];
    const clonedEnd = clonedGrid[endNode.row][endNode.col];

    const visitedNodesInOrder = algorithm(clonedGrid, clonedStart, clonedEnd);
    const shortestPath = reconstructPath(clonedEnd);

    setResult({ visitedNodesInOrder, shortestPath });
    setIsRunning(false);
  }

  function reset(grid: Node[][]) {
    resetGridState(grid);
    setResult(null);
  }

  return {
    result,
    isRunning,
    runBFS: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(bfs, grid, start, end),
    runDFS: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(dfs, grid, start, end),
    reset,
  };
}