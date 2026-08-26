import { useState } from 'react';
import Grid from './components/Grid/Grid';
import { createInitialGrid } from './utils/gridUtils';
import type { Node } from './types';

const NUM_ROWS = 15;
const NUM_COLS = 40;

function App() {
  const [grid] = useState<Node[][]>(() => createInitialGrid(NUM_ROWS, NUM_COLS));

  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>
      <Grid grid={grid} />
    </div>
  );
}

export default App;