import type { Node } from '../types';

const START_ROW = 5;
const START_COL = 5;
const END_ROW = 5;
const END_COL = 30;

export function createInitialGrid(numRows: number, numCols: number): Node[][] {
  const grid: Node[][] = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < numCols; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
}

function createNode(row: number, col: number): Node {
 const isStart = row === START_ROW && col === START_COL;
const isEnd = row === END_ROW && col === END_COL;
  return {
    row,
    col,
    isStart,
    isEnd,
    isWall: false,
    isVisited: false,
    previousNode: null,
};
}
export function getNewGridWithWallToggled(grid: Node[][], row: number, col: number): Node[][] {
  const node = grid[row][col];
  if (node.isStart || node.isEnd) return grid; // never wall over start/end

  const newRow = grid[row].slice();
  newRow[col] = { ...node, isWall: !node.isWall };

  const newGrid = grid.slice();
  newGrid[row] = newRow;

  return newGrid;
}