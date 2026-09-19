import { useState } from 'react';
import { StatsPanel } from './components/Stats/StatsPanel';
import { ComparisonPanel } from './components/Comparison/ComparisonPanel';
import Grid from './components/Grid/Grid';
import { ControlPanel } from './components/Controls/ControlPanel';
import { createInitialGrid } from './utils/gridUtils';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useAlgorithmComparison } from './hooks/useAlgorithmComparison';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';
import { generateRandomMaze } from './mazes/randomMaze';
import { generateRecursiveBacktrackingMaze } from './mazes/recursiveBacktracking';
import { prims } from './algorithms/mazeGeneration/prims';
import type { Node, AlgorithmResult } from './types';

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

  const [wallMode, setWallMode] = useState<
    'draw' | 'erase' | null
  >(null);

  const [animationSpeed, setAnimationSpeed] = useState(5);

  const [isComparisonPlayback, setIsComparisonPlayback] = useState(false);
const [comparisonIndex, setComparisonIndex] = useState(0);
const [comparisonComplete, setComparisonComplete] = useState(false);

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
    comparisonResults,
    isComparing,
    runComparison,
    clearComparison,
  } = useAlgorithmComparison();

  const activeAnimationResult: AlgorithmResult | null =
    isComparisonPlayback
      ? comparisonResults[comparisonIndex] ?? null
      : result;

  const { visitedNodeIndices, pathNodeIndices, isAnimating } =
  useAnimationPlayer(
    activeAnimationResult,
    animationSpeed,
    () => {
      if (!isComparisonPlayback) {
        return;
      }

      if (comparisonIndex < comparisonResults.length - 1) {
        setComparisonIndex((currentIndex) => currentIndex + 1);
      } else {
        setIsComparisonPlayback(false);
        setComparisonComplete(true);
      }
    }
  );

  const startNode = grid.flat().find((node) => node.isStart)!;
  const endNode = grid.flat().find((node) => node.isEnd)!;

  function handleVisualizeBFS() {
  setIsComparisonPlayback(false);
  setComparisonComplete(false);
  clearComparison();
  runBFS(grid, startNode, endNode);
}

 function handleVisualizeDFS() {
  setIsComparisonPlayback(false);
  setComparisonComplete(false);
  clearComparison();
  runBFS(grid, startNode, endNode);
}

  function handleVisualizeDijkstra() {
  setIsComparisonPlayback(false);
  setComparisonComplete(false);
  clearComparison();
  runBFS(grid, startNode, endNode);
}

  function handleVisualizeAStar() {
  setIsComparisonPlayback(false);
  setComparisonComplete(false);
  clearComparison();
  runBFS(grid, startNode, endNode);
}

  function handleCompareAlgorithms() {
  setIsComparisonPlayback(true);
  setComparisonIndex(0);
  setComparisonComplete(false);

  runComparison(grid, startNode, endNode);
}

  function handleReset() {
  reset(grid);
  clearComparison();

  setIsComparisonPlayback(false);
  setComparisonIndex(0);
  setComparisonComplete(false);

  setDraggingNode(null);
  setMouseIsPressed(false);
  setWallMode(null);
}

  function handleGenerateRandomMaze() {
    reset(grid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonIndex(0);

    const newGrid = generateRandomMaze(grid);

    setGrid(newGrid);
    setDraggingNode(null);
    setMouseIsPressed(false);
    setWallMode(null);
  }

  function handleGenerateRecursiveBacktracking() {
    reset(grid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonIndex(0);

    const newGrid = generateRecursiveBacktrackingMaze(grid);

    setGrid(newGrid);
    setDraggingNode(null);
    setMouseIsPressed(false);
    setWallMode(null);
  }

  function handleGeneratePrimsMaze() {
    reset(grid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonIndex(0);

    const newGrid = prims(grid);

    setGrid(newGrid);
    setDraggingNode(null);
    setMouseIsPressed(false);
    setWallMode(null);
  }

  function handleMouseDown(
    row: number,
    col: number,
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (e.button !== 0) return;

    const node = grid[row][col];

    if (node.isStart) {
      setDraggingNode('start');
      setMouseIsPressed(true);
      return;
    }

    if (node.isEnd) {
      setDraggingNode('end');
      setMouseIsPressed(true);
      return;
    }

    if (!node.isStart && !node.isEnd) {
      if (node.isWall) {
        setWallMode('erase');
      } else {
        setWallMode('draw');
      }

      const newGrid = grid.map((row) => [...row]);

      newGrid[row][col] = {
        ...node,
        isWall: !node.isWall,
      };

      setGrid(newGrid);
    }

    setMouseIsPressed(true);
  }

  function handleMouseEnter(row: number, col: number) {
    if (!mouseIsPressed) return;

    const node = grid[row][col];

    if (draggingNode === 'start') {
      if (node.isEnd || node.isWall) return;

      const newGrid = grid.map((row) => [...row]);

      for (const currentRow of newGrid) {
        for (const currentNode of currentRow) {
          if (currentNode.isStart) {
            currentNode.isStart = false;
          }
        }
      }

      newGrid[row][col] = {
        ...node,
        isStart: true,
        isEnd: false,
        isWall: false,
      };

      setGrid(newGrid);
      return;
    }

    if (draggingNode === 'end') {
      if (node.isStart || node.isWall) return;

      const newGrid = grid.map((row) => [...row]);

      for (const currentRow of newGrid) {
        for (const currentNode of currentRow) {
          if (currentNode.isEnd) {
            currentNode.isEnd = false;
          }
        }
      }

      newGrid[row][col] = {
        ...node,
        isEnd: true,
        isStart: false,
        isWall: false,
      };

      setGrid(newGrid);
      return;
    }

    if (!node.isStart && !node.isEnd && wallMode !== null) {
      const newGrid = grid.map((row) => [...row]);

      newGrid[row][col] = {
        ...node,
        isWall: wallMode === 'draw',
      };

      setGrid(newGrid);
    }
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
    setDraggingNode(null);
    setWallMode(null);
  }

  function handleRightClick(row: number, col: number) {
    const node = grid[row][col];

    if (node.isStart || node.isEnd || node.isWall) return;

    const newGrid = grid.map((row) => [...row]);

    const newWeight = node.weight === 1 ? 5 : 1;

    newGrid[row][col] = {
      ...node,
      weight: newWeight,
    };

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
        onGenerateRecursiveBacktracking={
          handleGenerateRecursiveBacktracking
        }
        onGeneratePrimsMaze={handleGeneratePrimsMaze}
        onCompareAlgorithms={handleCompareAlgorithms}
        isRunning={isRunning}
        isAnimating={isAnimating}
        isComparing={isComparing}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
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

      {!isComparisonPlayback &&
        result &&
        !isAnimating && (
          <StatsPanel stats={result.stats} />
        )}

      {comparisonComplete && (
  <ComparisonPanel
    results={comparisonResults}
    onClear={() => {
      clearComparison();
      setIsComparisonPlayback(false);
      setComparisonIndex(0);
      setComparisonComplete(false);
    }}
  />
)}
    </div>
  );
}

export default App;