import type { Node } from '../../types';
import './Grid.css';

interface CellProps {
  node: Node;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

function Cell({ node, onMouseDown, onMouseEnter, onMouseUp }: CellProps) {
  const { row, col, isStart, isEnd, isWall } = node;

  const extraClassName = isStart
    ? 'cell-start'
    : isEnd
    ? 'cell-end'
    : isWall
    ? 'cell-wall'
    : '';

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