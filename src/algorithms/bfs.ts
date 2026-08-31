import type { Node } from "../types";

export function getUnvisitedNeighbors(
  node: Node,
  grid: Node[][]
): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;

  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check bounds
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      const neighbor = grid[newRow][newCol];

      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}
export function bfs(
  grid: Node[][],
  startNode: Node,
  endNode: Node
): Node[] {
  const visitedNodesInOrder: Node[] = [];
  const queue: Node[] = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
visitedNodesInOrder.push(currentNode);

if (currentNode === endNode) {
    break;
}
const neighbors = getUnvisitedNeighbors(currentNode, grid);

for (const neighbor of neighbors) {
    neighbor.previousNode = currentNode;
    neighbor.isVisited = true;
    queue.push(neighbor);
}

  }

  return visitedNodesInOrder;
}
export function reconstructPath(endNode: Node): Node[] {
    const path: Node[] = [];
    let currentNode: Node | null = endNode;

    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return path;
}