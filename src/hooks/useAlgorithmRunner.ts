import type {
  Node,
  AlgorithmResult,
  AlgorithmStats,
} from '../types';
import { useState } from 'react';
import { bfs, reconstructPath } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { cloneGrid, resetGridState } from '../utils/gridUtils';

export function useAlgorithmRunner() {
  const [result, setResult] = useState<AlgorithmResult | null>(null);

  const [comparisonResults, setComparisonResults] = useState<
    AlgorithmResult[]
  >([]);

  const [isRunning, setIsRunning] = useState(false);

  function runAlgorithm(
    algorithm: (grid: Node[][], start: Node, end: Node) => Node[],
    algorithmName: string,
    grid: Node[][],
    startNode: Node,
    endNode: Node
  ) {
    setIsRunning(true);

    const clonedGrid = cloneGrid(grid);
    const clonedStart = clonedGrid[startNode.row][startNode.col];
    const clonedEnd = clonedGrid[endNode.row][endNode.col];

    const startTime = performance.now();

    const visitedNodesInOrder = algorithm(
      clonedGrid,
      clonedStart,
      clonedEnd
    );

    const shortestPath = reconstructPath(
      clonedEnd,
      clonedStart
    );

    const endTime = performance.now();

    const stats: AlgorithmStats = {
      algorithm: algorithmName,
      nodesVisited: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      executionTime: endTime - startTime,
    };

    const newResult: AlgorithmResult = {
      visitedNodesInOrder,
      shortestPath,
      stats,
    };

    setResult(newResult);
    setIsRunning(false);
  }

  function reset(grid: Node[][]) {
    resetGridState(grid);
    setResult(null);
    setComparisonResults([]);
    setIsRunning(false);
  }

  return {
    result,
    comparisonResults,
    isRunning,

    runBFS: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(bfs, 'BFS', grid, start, end),

    runDFS: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(dfs, 'DFS', grid, start, end),

    runDijkstra: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(dijkstra, 'Dijkstra', grid, start, end),

    runAStar: (grid: Node[][], start: Node, end: Node) =>
      runAlgorithm(astar, 'A*', grid, start, end),

    reset,
  };
}