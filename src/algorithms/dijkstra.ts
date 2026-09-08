import type { Node } from "../types";
import { PriorityQueue } from "./PriorityQueue";
import { getUnvisitedNeighbors } from "./bfs";

export function dijkstra(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): Node[] {
  const visitedNodesInOrder: Node[] = [];
  const pq = new PriorityQueue<Node>();

  startNode.distance = 0;
  pq.add(startNode, 0);

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

        pq.add(neighbor, newDistance);
    }
}
  }

  return visitedNodesInOrder;
}