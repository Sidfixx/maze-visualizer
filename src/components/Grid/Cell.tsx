import type { Node } from '../../types';
import './Grid.css';

interface CellProps {
  node: Node;
  onMouseDown: (row: number, col: number, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onRightClick: (row: number, col: number) => void;
  isVisited: boolean;
  isPath: boolean;
}

function Cell({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onRightClick,
  isVisited,
  isPath,
}: CellProps) {
  const { row, col, isStart, isEnd, isWall, weight } = node;

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
  } else if (weight > 1) {
    extraClassName = 'cell-weighted';
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onRightClick(row, col);
  };

  return (
    <div
      className={`cell ${extraClassName}`}
      onMouseDown={(e) => onMouseDown(row, col, e)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      onContextMenu={handleRightClick}
    />
  );
}

export default Cell;