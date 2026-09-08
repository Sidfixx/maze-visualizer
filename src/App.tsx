import { useState } from 'react';
import Grid from './components/Grid/Grid';
import { ControlPanel } from './components/Controls/ControlPanel';
import { createInitialGrid } from './utils/gridUtils';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';
import type { Node } from './types';

const NUM_ROWS = 15;
const NUM_COLS = 40;

function App() {
  const [grid, setGrid] = useState<Node[][]>(() => createInitialGrid(NUM_ROWS, NUM_COLS));
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [animationSpeed] = useState(1);

  // THIS LINE CHANGED: added runDijkstra
  const { result, isRunning, runBFS, runDFS, runDijkstra, reset } = useAlgorithmRunner();
  const { visitedNodeIndices, pathNodeIndices, isAnimating } = useAnimationPlayer(result, animationSpeed);

  const startNode = grid.flat().find(n => n.isStart)!;
  const endNode = grid.flat().find(n => n.isEnd)!;

  function handleVisualizeBFS() {
    runBFS(grid, startNode, endNode);
  }

  function handleVisualizeDFS() {
    runDFS(grid, startNode, endNode);
  }

  // THIS IS NEW: add this function
  function handleVisualizeDijkstra() {
    runDijkstra(grid, startNode, endNode);
  }

  function handleReset() {
    reset(grid);
  }

  function handleMouseDown(row: number, col: number) {
    const node = grid[row][col];
    if (!node.isStart && !node.isEnd) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = { ...node, isWall: !node.isWall };
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;
    const node = grid[row][col];
    if (!node.isStart && !node.isEnd) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = { ...node, isWall: !node.isWall };
      setGrid(newGrid);
    }
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
  }

  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>
      {/* THIS CHANGED: added onVisualizeDijkstra prop */}
      <ControlPanel
        onVisualizeBFS={handleVisualizeBFS}
        onVisualizeDFS={handleVisualizeDFS}
        onVisualizeDijkstra={handleVisualizeDijkstra}
        onReset={handleReset}
        isRunning={isRunning}
        isAnimating={isAnimating}
      />
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        visitedNodeIndices={visitedNodeIndices}
        pathNodeIndices={pathNodeIndices}
      />
    </div>
  );
}

export default App;