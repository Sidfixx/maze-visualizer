import type { Node } from '../../types';
import './Grid.css';

interface CellProps {
  node: Node;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  isVisited: boolean;
  isPath: boolean;
}

function Cell({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isVisited,
  isPath,
}: CellProps) {
  const { row, col, isStart, isEnd, isWall } = node;

  let extraClassName = '';
  if (isStart) {
    extraClassName = 'cell-start';
  } else if (isEnd) {
    extraClassName = 'cell-end';
  } else if (isPath) {
    extraClassName = 'cell-path';
  } else if (isVisited) {
    extraClassName = 'cell-visited';
  } else if (isWall) {
    extraClassName = 'cell-wall';
  }

  return (
    <div
      className={`cell ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    />
  );
}

export default Cell;