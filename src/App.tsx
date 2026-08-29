import { useState } from 'react';
import Grid from './components/Grid/Grid';
import { createInitialGrid, getNewGridWithWallToggled } from './utils/gridUtils';
import type { Node } from './types';

const NUM_ROWS = 15;
const NUM_COLS = 40;

function App() {
  const [grid, setGrid] = useState<Node[][]>(() => createInitialGrid(NUM_ROWS, NUM_COLS));
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  function handleMouseDown(row: number, col: number) {
    setGrid(getNewGridWithWallToggled(grid, row, col));
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;
    setGrid(getNewGridWithWallToggled(grid, row, col));
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default App;