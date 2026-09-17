import type { Node } from '../../types';
import { isReachable, carveCorridorToEnd } from '../../mazes/mazeUtils';

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
 * Generates a maze using Randomized Prim's Algorithm.
 *
 * How it works:
 * 1. Initialize all cells as walls, preserving Start and End nodes.
 * 2. Define passage "rooms" at odd row and column coordinates (stepping by 2),
 *    with walls dividing them at even coordinates.
 * 3. Start from the room containing (or closest to) the Start node.
 * 4. Add the starting room to the maze and register all its unvisited
 *    distance-2 neighbor rooms into the frontier list.
 * 5. While the frontier list is not empty:
 *    a. Pick a random frontier room from the list.
 *    b. Find all its distance-2 neighbor rooms that are already inside the maze.
 *    c. Pick one of those in-maze neighbors at random.
 *    d. Carve through the wall sitting directly between them (isWall = false).
 *    e. Carve through the frontier room cell itself (isWall = false).
 *    f. Mark the frontier room as in the maze, and add its unvisited distance-2
 *       neighbor rooms to the frontier list.
 * 6. Explicitly ensure Start and End nodes are not walls.
 * 7. Verify connectivity with `isReachable`; if disconnected, carve a minimal
 *    corridor to the End node using `carveCorridorToEnd`.
 *
 * Returns a brand-new Node[][] grid without mutating the input grid.
 */
export function prims(grid: Node[][]): Node[][] {
  // Locate Start and End nodes from the input grid
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
  // Cleanly reset algorithm states (isVisited, previousNode, distance)
  // while preserving node weights.
  const newGrid: Node[][] = grid.map(row =>
    row.map(node => ({
      ...node,
      isWall: !node.isStart && !node.isEnd,
      isVisited: false,
      previousNode: null,
      distance: Infinity,
    }))
  );

  // Tracking structures for rooms in the maze and in the frontier
  const inMaze: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );
  const isFrontier: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );
  const frontierList: [number, number][] = [];

  // Helper to add distance-2 unvisited room neighbors to the frontier
  function addFrontiers(r: number, c: number): void {
    for (const [dr, dc] of ROOM_DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 1 &&
        nr < numRows &&
        nc >= 1 &&
        nc < numCols &&
        !inMaze[nr][nc] &&
        !isFrontier[nr][nc]
      ) {
        isFrontier[nr][nc] = true;
        frontierList.push([nr, nc]);
      }
    }
  }

  // Step 2: Determine starting room for Prim's algorithm
  const startRoomRow = startNode.row % 2 === 1
    ? startNode.row
    : Math.max(1, Math.min(numRows - 2, startNode.row + 1));

  const startRoomCol = startNode.col % 2 === 1
    ? startNode.col
    : Math.max(1, Math.min(numCols - 2, startNode.col + 1));

  // Add the initial room to the maze and register initial frontiers
  inMaze[startRoomRow][startRoomCol] = true;
  newGrid[startRoomRow][startRoomCol].isWall = false;
  addFrontiers(startRoomRow, startRoomCol);

  // Step 3: Randomized Prim's loop
  while (frontierList.length > 0) {
    // Pick a random frontier room and remove it in O(1)
    const randomIndex = Math.floor(Math.random() * frontierList.length);
    const [fr, fc] = frontierList[randomIndex];

    frontierList[randomIndex] = frontierList[frontierList.length - 1];
    frontierList.pop();
    isFrontier[fr][fc] = false;

    // Find all distance-2 neighbor rooms that are already inside the maze
    const inMazeNeighbors: [number, number][] = [];
    for (const [dr, dc] of ROOM_DIRECTIONS) {
      const nr = fr + dr;
      const nc = fc + dc;

      if (
        nr >= 1 &&
        nr < numRows &&
        nc >= 1 &&
        nc < numCols &&
        inMaze[nr][nc]
      ) {
        inMazeNeighbors.push([nr, nc]);
      }
    }

    if (inMazeNeighbors.length > 0) {
      // Pick a random neighbor that is already in the maze
      const randomNeighborIndex = Math.floor(Math.random() * inMazeNeighbors.length);
      const [mr, mc] = inMazeNeighbors[randomNeighborIndex];

      // Carve the intermediate wall cell between the frontier and the in-maze neighbor
      const wallRow = (fr + mr) / 2;
      const wallCol = (fc + mc) / 2;
      newGrid[wallRow][wallCol].isWall = false;

      // Carve the frontier room cell itself and mark it as in-maze
      newGrid[fr][fc].isWall = false;
      inMaze[fr][fc] = true;

      // Add newly available distance-2 neighbor rooms to frontier
      addFrontiers(fr, fc);
    }
  }

  // Step 4: Explicitly ensure Start and End nodes are not walls
  const newStart = newGrid[startNode.row][startNode.col];
  const newEnd = newGrid[endNode.row][endNode.col];
  newStart.isWall = false;
  newEnd.isWall = false;

  // Step 5: Verify connectivity and guarantee a valid path between Start and End
  if (!isReachable(newGrid, newStart, newEnd)) {
    carveCorridorToEnd(newGrid, newStart, newEnd);
  }

  return newGrid;
}

/** Alias export for consistent naming across maze generators */
export const generatePrimsMaze = prims;
