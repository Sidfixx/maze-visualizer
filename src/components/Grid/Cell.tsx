import type { Node } from '../../types';
import './Grid.css';

interface CellProps {
  node: Node;
}

function Cell({ node }: CellProps) {
  const { isStart, isEnd, isWall } = node;

  const extraClassName = isStart
    ? 'cell-start'
    : isEnd
    ? 'cell-end'
    : isWall
    ? 'cell-wall'
    : '';

  return <div className={`cell ${extraClassName}`} />;
}

export default Cell;