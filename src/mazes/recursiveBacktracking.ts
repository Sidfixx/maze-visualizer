import type { Node } from '../types';
import { isReachable, carveCorridorToEnd } from './mazeUtils';

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * Returns a new shuffled copy so the input array is never mutated.
 */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Step vectors for exploring room cells 2 units away:
 * [deltaRow, deltaCol] -> Up, Down, Left, Right
 */
const ROOM_DIRECTIONS: [number, number][] = [
  [-2, 0], // Up
  [2, 0],  // Down
  [0, -2], // Left
  [0, 2],  // Right
];

/**
 * Generates a maze using the Recursive Backtracking (DFS) algorithm.
 *
 * How it works:
 * 1. Start with every cell filled as a wall (solid stone), preserving Start and End.
 * 2. Define "rooms" at odd row and odd column coordinates (r % 2 === 1 && c % 2 === 1).
 *    Even rows and columns act as the walls dividing these rooms.
 * 3. Starting from the room containing the Start node, explore unvisited room neighbours
 *    at distance 2 in randomized order.
 * 4. For each unvisited room neighbour:
 *    - Carve through the wall cell sitting directly between them (isWall = false).
 *    - Carve through the neighbour room cell itself (isWall = false).
 *    - Recursively continue carving from that neighbour.
 * 5. Backtrack when a room has no remaining unvisited neighbours.
 * 6. After the carving is complete, perform a BFS connectivity check between Start
 *    and End using `isReachable`. If the End node is ever blocked, carve a minimal
 *    corridor to reconnect it using `carveCorridorToEnd`.
 *
 * Returns a brand-new Node[][] grid without mutating the input grid.
 */
export function generateRecursiveBacktrackingMaze(grid: Node[][]): Node[][] {
  // Locate the Start and End nodes from the input grid
  let startNode: Node | null = null;
  let endNode: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) startNode = node;
      if (node.isEnd) endNode = node;
    }
  }

  // Safety fallback: if start or end are missing, return grid unchanged
  if (!startNode || !endNode) return grid;

  const numRows = grid.length;
  const numCols = grid[0].length;

  // Step 1: Initialize all cells as walls, except Start and End nodes.
  // Also reset algorithm states (isVisited, previousNode, distance).
  const newGrid: Node[][] = grid.map(row =>
    row.map(node => ({
      ...node,
      isWall: !node.isStart && !node.isEnd,
      isVisited: false,
      previousNode: null,
      distance: Infinity,
    }))
  );

  // 2D boolean array to track which room cells have been visited by the DFS
  const visitedRooms: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );

  /**
   * Recursive depth-first search to carve passages between rooms.
   */
  function dfsCarve(r: number, c: number): void {
    visitedRooms[r][c] = true;
    newGrid[r][c].isWall = false;

    // Randomize the order of movement to create an organic, winding maze
    const randomizedDirections = shuffle(ROOM_DIRECTIONS);

    for (const [dr, dc] of randomizedDirections) {
      const nr = r + dr;
      const nc = c + dc;

      // Ensure the target room is within grid boundaries and hasn't been visited yet
      if (
        nr >= 1 &&
        nr < numRows &&
        nc >= 1 &&
        nc < numCols &&
        !visitedRooms[nr][nc]
      ) {
        // Carve the wall cell between current room (r, c) and neighbour room (nr, nc)
        const wallRow = r + dr / 2;
        const wallCol = c + dc / 2;
        newGrid[wallRow][wallCol].isWall = false;

        // Carve the neighbour room
        newGrid[nr][nc].isWall = false;

        // Recurse into the neighbour room
        dfsCarve(nr, nc);
      }
    }
  }

  // Step 2: Determine starting room for DFS.
  // Standard start node (5, 5) is at odd row and odd column, making it a natural room.
  // If start is ever positioned on an even row/col, find the nearest odd room coordinates.
  const startRoomRow = startNode.row % 2 === 1
    ? startNode.row
    : Math.max(1, Math.min(numRows - 2, startNode.row + 1));

  const startRoomCol = startNode.col % 2 === 1
    ? startNode.col
    : Math.max(1, Math.min(numCols - 2, startNode.col + 1));

  // Run the recursive DFS carve starting from the start room
  dfsCarve(startRoomRow, startRoomCol);

  // Step 3: Explicitly ensure Start and End nodes are not walls
  const newStart = newGrid[startNode.row][startNode.col];
  const newEnd = newGrid[endNode.row][endNode.col];
  newStart.isWall = false;
  newEnd.isWall = false;

  // Step 4: Verify connectivity and guarantee a valid path between Start and End
  if (!isReachable(newGrid, newStart, newEnd)) {
    carveCorridorToEnd(newGrid, newStart, newEnd);
  }

  return newGrid;
}
