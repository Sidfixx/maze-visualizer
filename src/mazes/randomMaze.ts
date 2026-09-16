import type { Node } from '../types';
import { isReachable, carveCorridorToEnd } from './mazeUtils';

/**
 * Probability that any given non-start, non-end cell becomes a wall.
 * 0.30 means ~30% of cells are walls — dense enough to be interesting,
 * sparse enough that a path almost always exists naturally.
 */
const WALL_DENSITY = 0.3;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generates a random maze on the grid by:
 *  1. Scattering walls at WALL_DENSITY probability (never on start/end).
 *  2. Running a BFS to check whether the end node is still reachable.
 *  3. If not, carving a straight BFS corridor through walls to reconnect them.
 *
 * Returns a brand-new Node[][] — the original grid is never mutated.
 */
export function generateRandomMaze(grid: Node[][]): Node[][] {
  // Locate start and end nodes before building the new grid.
  let startNode: Node | null = null;
  let endNode: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) startNode = node;
      if (node.isEnd) endNode = node;
    }
  }

  // Safety guard: if the grid somehow has no start/end, return it unchanged.
  if (!startNode || !endNode) return grid;

  // Step 1 — build a fresh grid with randomly placed walls.
  const newGrid: Node[][] = grid.map(row =>
    row.map(node => ({
      ...node,
      isWall: !node.isStart && !node.isEnd && Math.random() < WALL_DENSITY,
      // Reset all pathfinding state so the new grid is clean.
      isVisited: false,
      previousNode: null,
      distance: Infinity,
    }))
  );

  const newStart = newGrid[startNode.row][startNode.col];
  const newEnd   = newGrid[endNode.row][endNode.col];

  // Step 2 — verify connectivity; carve a corridor if needed.
  if (!isReachable(newGrid, newStart, newEnd)) {
    carveCorridorToEnd(newGrid, newStart, newEnd);
  }

  return newGrid;
}
