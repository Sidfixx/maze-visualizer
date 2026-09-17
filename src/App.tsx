import { useState } from 'react';
import { StatsPanel } from './components/Stats/StatsPanel';
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
  const [grid, setGrid] = useState<Node[][]>(() =>
    createInitialGrid(NUM_ROWS, NUM_COLS)
  );

  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const [draggingNode, setDraggingNode] = useState<
    'start' | 'end' | null
  >(null);

  const [animationSpeed] = useState(1);

  const {
    result,
    isRunning,
    runBFS,
    runDFS,
    runDijkstra,
    runAStar,
    reset,
  } = useAlgorithmRunner();

  const {
    visitedNodeIndices,
    pathNodeIndices,
    isAnimating,
  } = useAnimationPlayer(result, animationSpeed);

  const startNode = grid.flat().find((node) => node.isStart)!;
  const endNode = grid.flat().find((node) => node.isEnd)!;

  // -----------------------------
  // Pathfinding
  // -----------------------------

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

  // -----------------------------
  // Reset Algorithm
  // -----------------------------

  function handleReset() {
    reset(grid);

    // IMPORTANT:
    // Do NOT create a new grid here.
    // The existing maze, walls, weights,
    // Start and End should remain.
    setDraggingNode(null);
    setMouseIsPressed(false);
  }

  // -----------------------------
  // Maze Generation
  // -----------------------------

  function handleGenerateRandomMaze() {
    reset(grid);

    const newGrid = generateRandomMaze(grid);
    setGrid(newGrid);

    setDraggingNode(null);
    setMouseIsPressed(false);
  }

  function handleGenerateRecursiveBacktracking() {
    reset(grid);

    const newGrid = generateRecursiveBacktrackingMaze(grid);
    setGrid(newGrid);

    setDraggingNode(null);
    setMouseIsPressed(false);
  }

  function handleGeneratePrimsMaze() {
    reset(grid);

    const newGrid = prims(grid);
    setGrid(newGrid);

    setDraggingNode(null);
    setMouseIsPressed(false);
  }

  // -----------------------------
  // Mouse Down
  // -----------------------------

  function handleMouseDown(
    row: number,
    col: number,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (e.button !== 0) return;

    const node = grid[row][col];

    // Start dragging Start node
    if (node.isStart) {
      setDraggingNode('start');
      setMouseIsPressed(true);
      return;
    }

    // Start dragging End node
    if (node.isEnd) {
      setDraggingNode('end');
      setMouseIsPressed(true);
      return;
    }

    // Normal wall interaction
    if (!node.isStart && !node.isEnd) {
      const newGrid = grid.map((row) => [...row]);

      newGrid[row][col] = {
        ...node,
        isWall: !node.isWall,
      };

      setGrid(newGrid);
    }

    setMouseIsPressed(true);
  }

  // -----------------------------
  // Mouse Enter
  // -----------------------------

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;

    const node = grid[row][col];

    // Dragging Start
    if (draggingNode === 'start') {
      if (node.isEnd || node.isWall) return;

      const newGrid = grid.map((row) => [...row]);

      // Remove old Start
      for (const currentRow of newGrid) {
        for (const currentNode of currentRow) {
          if (currentNode.isStart) {
            currentNode.isStart = false;
          }
        }
      }

      // Place new Start
      newGrid[row][col] = {
        ...node,
        isStart: true,
        isEnd: false,
        isWall: false,
      };

      setGrid(newGrid);
      return;
    }

    // Dragging End
    if (draggingNode === 'end') {
      if (node.isStart || node.isWall) return;

      const newGrid = grid.map((row) => [...row]);

      // Remove old End
      for (const currentRow of newGrid) {
        for (const currentNode of currentRow) {
          if (currentNode.isEnd) {
            currentNode.isEnd = false;
          }
        }
      }

      // Place new End
      newGrid[row][col] = {
        ...node,
        isEnd: true,
        isStart: false,
        isWall: false,
      };

      setGrid(newGrid);
      return;
    }

    // Normal wall drawing
    if (!node.isStart && !node.isEnd) {
      const newGrid = grid.map((row) => [...row]);

      newGrid[row][col] = {
        ...node,
        isWall: !node.isWall,
      };

      setGrid(newGrid);
    }
  }

  // -----------------------------
  // Mouse Up
  // -----------------------------

  function handleMouseUp() {
    setMouseIsPressed(false);
    setDraggingNode(null);
  }

  // -----------------------------
  // Right Click / Weight
  // -----------------------------

  function handleRightClick(row: number, col: number) {
    const node = grid[row][col];

    // Cannot weight Start, End or walls
    if (node.isStart || node.isEnd || node.isWall) return;

    const newGrid = grid.map((row) => [...row]);

    const newWeight = node.weight === 1 ? 5 : 1;

    newGrid[row][col] = {
      ...node,
      weight: newWeight,
    };

    setGrid(newGrid);
  }

  // -----------------------------
  // Render
  // -----------------------------

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
        onGenerateRecursiveBacktracking={
          handleGenerateRecursiveBacktracking
        }
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