import { useState } from 'react';
import type { Node, AlgorithmResult, AlgorithmStats } from '../types';
import { bfs, reconstructPath } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { cloneGrid } from '../utils/gridUtils';

type AlgorithmFunction = (
  grid: Node[][],
  start: Node,
  end: Node
) => Node[];

interface AlgorithmDefinition {
  name: string;
  algorithm: AlgorithmFunction;
}

const algorithms: AlgorithmDefinition[] = [
  {
    name: 'BFS',
    algorithm: bfs,
  },
  {
    name: 'DFS',
    algorithm: dfs,
  },
  {
    name: 'Dijkstra',
    algorithm: dijkstra,
  },
  {
    name: 'A*',
    algorithm: astar,
  },
];

export function useAlgorithmComparison() {
  const [comparisonResults, setComparisonResults] = useState<
    AlgorithmResult[]
  >([]);

  const [isComparing, setIsComparing] = useState(false);

  function runComparison(
    grid: Node[][],
    startNode: Node,
    endNode: Node
  ) {
    setIsComparing(true);
    setComparisonResults([]);

    const results: AlgorithmResult[] = [];

    for (const { name, algorithm } of algorithms) {
      // Every algorithm gets its own fresh copy
      const clonedGrid = cloneGrid(grid);

      const clonedStart =
        clonedGrid[startNode.row][startNode.col];

      const clonedEnd =
        clonedGrid[endNode.row][endNode.col];

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
        algorithm: name,
        nodesVisited: visitedNodesInOrder.length,
        pathLength: shortestPath.length,
        executionTime: endTime - startTime,
      };

      results.push({
        visitedNodesInOrder,
        shortestPath,
        stats,
      });
    }

    setComparisonResults(results);
    setIsComparing(false);
  }

  function clearComparison() {
    setComparisonResults([]);
    setIsComparing(false);
  }

  return {
    comparisonResults,
    isComparing,
    runComparison,
    clearComparison,
  };
}