import type { Node } from '../types';

/**
 * Shared utility helpers for maze-generation algorithms.
 *
 * These functions are used by randomMaze.ts, recursiveBacktracking.ts,
 * and any future maze generators (e.g. Recursive Division).
 * They depend only on the Node type and make no assumptions about how
 * the maze was built.
 */

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

/** Stable string key for a node's position. */
export function nodeKey(node: Node): string {
  return `${node.row},${node.col}`;
}

/**
 * Returns the four cardinal (up / down / left / right) neighbours of `node`
 * that lie within the grid bounds.
 */
export function getCardinalNeighbors(node: Node, grid: Node[][]): Node[] {
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

// ---------------------------------------------------------------------------
// Connectivity helpers
// ---------------------------------------------------------------------------

/**
 * BFS that respects walls.
 * Returns true if `end` is reachable from `start` without passing through
 * any wall cell.
 */
export function isReachable(grid: Node[][], start: Node, end: Node): boolean {
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
 * `start` to `end`, then clears (sets isWall = false) every cell along
 * that route.
 *
 * Call this only after `isReachable` has returned false. It guarantees
 * at least one open path while disturbing as few walls as possible — the
 * BFS finds the shortest geometric route regardless of wall status, so the
 * carved corridor is always minimal.
 *
 * Note: this mutates `grid` in place. All maze generators build a fresh
 * Node[][] before calling maze-specific logic, so mutation is intentional.
 */
export function carveCorridorToEnd(grid: Node[][], start: Node, end: Node): void {
  // Track which node discovered each cell so we can trace the path back.
  const cameFrom = new Map<string, Node | null>();
  const queue: Node[] = [start];
  cameFrom.set(nodeKey(start), null);

  // BFS ignoring walls — every cell is traversable regardless of isWall.
  outer: while (queue.length > 0) {
    const current = queue.shift()!;

    for (const neighbor of getCardinalNeighbors(current, grid)) {
      const key = nodeKey(neighbor);
      if (!cameFrom.has(key)) {
        cameFrom.set(key, current);
        queue.push(neighbor);

        if (neighbor.row === end.row && neighbor.col === end.col) {
          break outer; // Reached end; stop expanding.
        }
      }
    }
  }

  // Walk backwards from end → start and clear every wall on the route.
  let current: Node | null = end;
  while (current !== null) {
    current.isWall = false;
    current = cameFrom.get(nodeKey(current)) ?? null;
  }
}
