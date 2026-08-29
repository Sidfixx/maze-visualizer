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