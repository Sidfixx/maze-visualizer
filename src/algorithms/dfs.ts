import type { Node } from "../types";
import { getUnvisitedNeighbors } from "./bfs";

export function dfs(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): Node[] {
  const visitedNodesInOrder: Node[] = [];

  dfsHelper(startNode, grid, visitedNodesInOrder, endNode);

  return visitedNodesInOrder;
}

function dfsHelper(
  node: Node,
  grid: Node[][],
  visitedNodesInOrder: Node[],
  endNode: Node
): void {
  // If already visited, stop.
  if (node.isVisited) return;

  // Visit this node.
  node.isVisited = true;
  visitedNodesInOrder.push(node);

  // Stop searching if we reached the destination.
  if (node === endNode) return;

  // Explore all valid neighbours.
  const neighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of neighbors) {
    neighbor.previousNode = node;
    dfsHelper(neighbor, grid, visitedNodesInOrder, endNode);
  }
}