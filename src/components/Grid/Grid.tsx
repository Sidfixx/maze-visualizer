import type { Node } from '../../types';
import Cell from './Cell';
import './Grid.css';

interface GridProps {
  grid: Node[][];
}

function Grid({ grid }: GridProps) {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, colIdx) => (
            <Cell key={colIdx} node={node} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;