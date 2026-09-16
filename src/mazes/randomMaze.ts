import type { Node } from '../types';

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

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * BFS that respects walls.
 * Returns true if `end` is reachable from `start`.
 */
function isReachable(grid: Node[][], start: Node, end: Node): boolean {
  const visited = new Set<string>();
  const queue: Node[] = [start];
  visited.add(nodeKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      return true;
    }

    for (const neighbor of getCardinalNeighbors(current, grid)) {
      const key = nodeKey(neighbor);
      if (!visited.has(key) && !neighbor.isWall) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

/**
 * BFS that IGNORES walls to find the geometrically shortest route from
 * `start` to `end`, then clears any wall along that route.
 *
 * This guarantees at least one open path exists after the maze is generated,
 * while disturbing as few walls as possible.
 */
function carveCorridorToEnd(grid: Node[][], start: Node, end: Node): void {
  // Map each visited node to the node that discovered it so we can trace back.
  const cameFrom = new Map<string, Node | null>();
  const queue: Node[] = [start];
  cameFrom.set(nodeKey(start), null);

  // BFS — traverse all cells regardless of wall status.
  outer: while (queue.length > 0) {
    const current = queue.shift()!;

    for (const neighbor of getCardinalNeighbors(current, grid)) {
      const key = nodeKey(neighbor);
      if (!cameFrom.has(key)) {
        cameFrom.set(key, current);
        queue.push(neighbor);

        if (neighbor.row === end.row && neighbor.col === end.col) {
          break outer; // Found the end; stop expanding.
        }
      }
    }
  }

  // Trace the path backwards from end → start and clear every wall along it.
  let current: Node | null = end;
  while (current !== null) {
    // Clear the wall on this cell (start/end are never walls, so this is safe).
    current.isWall = false;
    current = cameFrom.get(nodeKey(current)) ?? null;
  }
}

/**
 * Returns the four cardinal (up/down/left/right) neighbours of `node`
 * that lie within the grid bounds.
 */
function getCardinalNeighbors(node: Node, grid: Node[][]): Node[] {
  const { row, col } = node;
  const neighbors: Node[] = [];

  const directions: [number, number][] = [
    [-1,  0], // up
    [ 1,  0], // down
    [ 0, -1], // left
    [ 0,  1], // right
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      neighbors.push(grid[r][c]);
    }
  }

  return neighbors;
}

/** Stable string key for a node's position. */
function nodeKey(node: Node): string {
  return `${node.row},${node.col}`;
}
