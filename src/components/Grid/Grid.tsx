import type { Node } from '../../types';
import Cell from './Cell';
import './Grid.css';

interface GridProps {
  grid: Node[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }: GridProps) {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, colIdx) => (
            <Cell
              key={colIdx}
              node={node}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onMouseUp={onMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;