import type { Node } from '../../types';
import Cell from './Cell';
import './Grid.css';

interface GridProps {
  grid: Node[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  visitedNodeIndices: Set<string>;
  pathNodeIndices: Set<string>;
}

function Grid({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  visitedNodeIndices,
  pathNodeIndices,
}: GridProps) {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, colIdx) => {
            const nodeKey = `${node.row},${node.col}`;
            const isVisited = visitedNodeIndices.has(nodeKey);
            const isPath = pathNodeIndices.has(nodeKey);

            return (
              <Cell
                key={colIdx}
                node={node}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
                isVisited={isVisited}
                isPath={isPath}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;