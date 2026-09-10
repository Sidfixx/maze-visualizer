import type { Node } from "../types";
import { PriorityQueue } from "./PriorityQueue";
import { getUnvisitedNeighbors } from "./bfs";

// Manhattan Distance Heuristic
function heuristic(node: Node, endNode: Node): number {
  return (
    Math.abs(node.row - endNode.row) +
    Math.abs(node.col - endNode.col)
  );
}

export function astar(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): Node[] {
  const visitedNodesInOrder: Node[] = [];
  const pq = new PriorityQueue<Node>();

  startNode.distance = 0;
  pq.add(startNode, heuristic(startNode, endNode));

  while (!pq.isEmpty()) {
    const currentNode = pq.extractMin();

    if (!currentNode) break;

    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      break;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      const newDistance = currentNode.distance + neighbor.weight;

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previousNode = currentNode;

        const f = newDistance + heuristic(neighbor, endNode);

        pq.add(neighbor, f);
      }
    }
  }

  return visitedNodesInOrder;
}