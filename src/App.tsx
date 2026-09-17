import { StatsPanel } from './components/Stats/StatsPanel';
import { useState } from 'react';
import Grid from './components/Grid/Grid';
import { ControlPanel } from './components/Controls/ControlPanel';
import { createInitialGrid } from './utils/gridUtils';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';
import { generateRandomMaze } from './mazes/randomMaze';
import { generateRecursiveBacktrackingMaze } from './mazes/recursiveBacktracking';
import { prims } from './algorithms/mazeGeneration/prims';
import type { Node } from './types';

const NUM_ROWS = 15;
const NUM_COLS = 40;

function App() {
  const [grid, setGrid] = useState<Node[][]>(() => createInitialGrid(NUM_ROWS, NUM_COLS));
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [animationSpeed] = useState(1);

  const { result, isRunning, runBFS, runDFS, runDijkstra, runAStar, reset } = useAlgorithmRunner();
  const { visitedNodeIndices, pathNodeIndices, isAnimating } = useAnimationPlayer(result, animationSpeed);

  const startNode = grid.flat().find(n => n.isStart)!;
  const endNode = grid.flat().find(n => n.isEnd)!;

  function handleVisualizeBFS() {
    runBFS(grid, startNode, endNode);
  }

  function handleVisualizeDFS() {
    runDFS(grid, startNode, endNode);
  }

  function handleVisualizeDijkstra() {
    runDijkstra(grid, startNode, endNode);
  }

  function handleVisualizeAStar() {
    runAStar(grid, startNode, endNode);
  }

  function handleReset() {
    reset(grid);
  }

  function handleGenerateRandomMaze() {
    // Clear any existing algorithm result / animation first.
    reset(grid);
    // Generate a brand-new grid with random walls, then replace state.
    setGrid(generateRandomMaze(grid));
  }

  function handleGenerateRecursiveBacktracking() {
    // Clear any existing algorithm result / animation first.
    reset(grid);
    // Generate a brand-new grid with Recursive Backtracking maze, then replace state.
    setGrid(generateRecursiveBacktrackingMaze(grid));
  }

  function handleGeneratePrimsMaze() {
    // Clear any existing algorithm result / animation first.
    reset(grid);
    // Generate a brand-new grid with Prim's maze, then replace state.
    setGrid(prims(grid));
  }

  function handleMouseDown(row: number, col: number, e: React.MouseEvent<HTMLDivElement>) {
    // Only respond to left-click (button 0)
    if (e.button !== 0) return;

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

  function handleRightClick(row: number, col: number) {
  const node = grid[row][col];
  
  if (node.isStart || node.isEnd || node.isWall) return;

  const newGrid = grid.map(r => [...r]);
  const newWeight = node.weight === 1 ? 5 : 1;
  console.log('Setting cell weight to:', newWeight);  // ADD THIS
  newGrid[row][col] = { ...node, weight: newWeight };
  setGrid(newGrid);
}
  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>
      <ControlPanel
        onVisualizeBFS={handleVisualizeBFS}
        onVisualizeDFS={handleVisualizeDFS}
        onVisualizeDijkstra={handleVisualizeDijkstra}
        onVisualizeAStar={handleVisualizeAStar}
        onReset={handleReset}
        onGenerateRandomMaze={handleGenerateRandomMaze}
        onGenerateRecursiveBacktracking={handleGenerateRecursiveBacktracking}
        onGeneratePrimsMaze={handleGeneratePrimsMaze}
        isRunning={isRunning}
        isAnimating={isAnimating}
      />
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onRightClick={handleRightClick}
        visitedNodeIndices={visitedNodeIndices}
        pathNodeIndices={pathNodeIndices}
      />
      <StatsPanel stats={result?.stats} />
    </div>
  );
}

export default App;