import { useState } from 'react';

import { StatsPanel } from './components/Stats/StatsPanel';
import { ComparisonPanel } from './components/Comparison/ComparisonPanel';
import { AlgorithmInfoPanel } from './components/AlgorithmInfo/AlgorithmInfoPanel';
import { Legend } from './components/Legend/Legend';
import Grid from './components/Grid/Grid';
import { ControlPanel } from './components/Controls/ControlPanel';

import { createInitialGrid } from './utils/gridUtils';

import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { useAlgorithmComparison } from './hooks/useAlgorithmComparison';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';

import { generateRandomMaze } from './mazes/randomMaze';
import { generateRecursiveBacktrackingMaze } from './mazes/recursiveBacktracking';
import { prims } from './algorithms/mazeGeneration/prims';

import type {
  Node,
  AlgorithmResult,
} from './types';

const NUM_ROWS = 15;
const NUM_COLS = 40;

function App() {
  const [grid, setGrid] = useState<Node[][]>(() =>
    createInitialGrid(NUM_ROWS, NUM_COLS)
  );

  const [mouseIsPressed, setMouseIsPressed] =
    useState(false);

  const [draggingNode, setDraggingNode] = useState<
    'start' | 'end' | null
  >(null);

  const [wallMode, setWallMode] = useState<
    'draw' | 'erase' | null
  >(null);

  const [animationSpeed, setAnimationSpeed] =
    useState(5);

  const [isComparisonPlayback, setIsComparisonPlayback] =
    useState(false);

  const [comparisonIndex, setComparisonIndex] =
    useState(0);

  const [comparisonComplete, setComparisonComplete] =
    useState(false);

  const [statusMessage, setStatusMessage] =
    useState('Ready');

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

  const {
    visitedNodeIndices,
    pathNodeIndices,
    isAnimating,
  } = useAnimationPlayer(
    activeAnimationResult,
    animationSpeed,
    () => {
      if (!isComparisonPlayback) {
        setStatusMessage('Ready');
        return;
      }

      if (
        comparisonIndex <
        comparisonResults.length - 1
      ) {
        setComparisonIndex(
          (currentIndex) => currentIndex + 1
        );
      } else {
        setIsComparisonPlayback(false);
        setComparisonComplete(true);
        setStatusMessage('Comparison complete');
      }
    }
  );

  const startNode = grid
    .flat()
    .find((node) => node.isStart)!;

  const endNode = grid
    .flat()
    .find((node) => node.isEnd)!;

  /*
   * The grid should not be editable while an algorithm
   * or comparison is running.
   */
  const interactionDisabled =
    isRunning ||
    isAnimating ||
    isComparing ||
    isComparisonPlayback;

  // ==========================================
  // PATHFINDING
  // ==========================================

  function handleVisualizeBFS() {
    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    clearComparison();
    setStatusMessage('Visualizing BFS...');

    runBFS(grid, startNode, endNode);
  }

  function handleVisualizeDFS() {
    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    clearComparison();
    setStatusMessage('Visualizing DFS...');

    runDFS(grid, startNode, endNode);
  }

  function handleVisualizeDijkstra() {
    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    clearComparison();
    setStatusMessage('Visualizing Dijkstra...');

    runDijkstra(grid, startNode, endNode);
  }

  function handleVisualizeAStar() {
    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    clearComparison();
    setStatusMessage('Visualizing A*...');

    runAStar(grid, startNode, endNode);
  }

  // ==========================================
  // ALGORITHM COMPARISON
  // ==========================================

  function handleCompareAlgorithms() {
    setIsComparisonPlayback(true);
    setComparisonIndex(0);
    setComparisonComplete(false);
    setStatusMessage('Comparing algorithms...');

    runComparison(grid, startNode, endNode);
  }

  // ==========================================
  // MAZE GENERATION
  // ==========================================

  function handleGenerateRandomMaze() {
    const newGrid = generateRandomMaze(grid);

    setGrid(newGrid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    setComparisonIndex(0);
    setStatusMessage('Ready');
  }

  function handleGenerateRecursiveBacktracking() {
    const newGrid =
      generateRecursiveBacktrackingMaze(grid);

    setGrid(newGrid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    setComparisonIndex(0);
    setStatusMessage('Ready');
  }

  function handleGeneratePrimsMaze() {
    const newGrid = prims(grid);

    setGrid(newGrid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonComplete(false);
    setComparisonIndex(0);
    setStatusMessage('Ready');
  }

  // ==========================================
  // RESET
  // ==========================================

  function handleReset() {
    reset(grid);
    clearComparison();

    setIsComparisonPlayback(false);
    setComparisonIndex(0);
    setComparisonComplete(false);
    setStatusMessage('Ready');

    setDraggingNode(null);
    setMouseIsPressed(false);
    setWallMode(null);
  }

  // ==========================================
  // GRID INTERACTION
  // ==========================================

  function handleMouseDown(
    row: number,
    col: number
  ) {
    /*
     * Do not allow grid editing while an algorithm
     * or comparison is being visualized.
     */
    if (interactionDisabled) {
      return;
    }

    const node = grid[row][col];

    // Start node
    if (node.isStart) {
      setDraggingNode('start');
      setMouseIsPressed(true);
      return;
    }

    // End node
    if (node.isEnd) {
      setDraggingNode('end');
      setMouseIsPressed(true);
      return;
    }

    // Wall drawing / erasing
    if (node.isWall) {
      setWallMode('erase');
    } else {
      setWallMode('draw');
    }

    setMouseIsPressed(true);

    setGrid((currentGrid) =>
      currentGrid.map((currentRow, rowIndex) =>
        currentRow.map((currentNode, colIndex) => {
          if (
            rowIndex === row &&
            colIndex === col
          ) {
            return {
              ...currentNode,
              isWall: !currentNode.isWall,
            };
          }

          return currentNode;
        })
      )
    );
  }

  function handleMouseEnter(
    row: number,
    col: number
  ) {
    if (interactionDisabled) {
      return;
    }

    if (!mouseIsPressed) {
      return;
    }

    const node = grid[row][col];

    // Drag Start
    if (draggingNode === 'start') {
      if (node.isEnd || node.isWall) {
        return;
      }

      setGrid((currentGrid) =>
        currentGrid.map((currentRow) =>
          currentRow.map((currentNode) => {
            if (
              currentNode.isStart &&
              currentNode !== node
            ) {
              return {
                ...currentNode,
                isStart: false,
              };
            }

            if (currentNode === node) {
              return {
                ...currentNode,
                isStart: true,
                isWall: false,
              };
            }

            return currentNode;
          })
        )
      );

      return;
    }

    // Drag End
    if (draggingNode === 'end') {
      if (node.isStart || node.isWall) {
        return;
      }

      setGrid((currentGrid) =>
        currentGrid.map((currentRow) =>
          currentRow.map((currentNode) => {
            if (
              currentNode.isEnd &&
              currentNode !== node
            ) {
              return {
                ...currentNode,
                isEnd: false,
              };
            }

            if (currentNode === node) {
              return {
                ...currentNode,
                isEnd: true,
                isWall: false,
              };
            }

            return currentNode;
          })
        )
      );

      return;
    }

    // Draw / erase walls
    if (wallMode) {
      if (node.isStart || node.isEnd) {
        return;
      }

      setGrid((currentGrid) =>
        currentGrid.map((currentRow) =>
          currentRow.map((currentNode) => {
            if (
              currentNode.row === row &&
              currentNode.col === col
            ) {
              return {
                ...currentNode,
                isWall:
                  wallMode === 'draw',
              };
            }

            return currentNode;
          })
        )
      );
    }
  }

  function handleMouseUp() {
    setMouseIsPressed(false);
    setDraggingNode(null);
    setWallMode(null);
  }

  function handleRightClick(
    row: number,
    col: number
  ) {
    if (interactionDisabled) {
      return;
    }

    const node = grid[row][col];

    if (
      node.isStart ||
      node.isEnd ||
      node.isWall
    ) {
      return;
    }

    setGrid((currentGrid) =>
      currentGrid.map((currentRow) =>
        currentRow.map((currentNode) => {
          if (
            currentNode.row === row &&
            currentNode.col === col
          ) {
            return {
              ...currentNode,
              weight:
                currentNode.weight === 1
                  ? 5
                  : 1,
            };
          }

          return currentNode;
        })
      )
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>

      <ControlPanel
        onVisualizeBFS={handleVisualizeBFS}
        onVisualizeDFS={handleVisualizeDFS}
        onVisualizeDijkstra={
          handleVisualizeDijkstra
        }
        onVisualizeAStar={handleVisualizeAStar}
        onReset={handleReset}
        onGenerateRandomMaze={
          handleGenerateRandomMaze
        }
        onGenerateRecursiveBacktracking={
          handleGenerateRecursiveBacktracking
        }
        onGeneratePrimsMaze={
          handleGeneratePrimsMaze
        }
        onCompareAlgorithms={
          handleCompareAlgorithms
        }
        isRunning={isRunning}
        isAnimating={isAnimating}
        isComparing={isComparing}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        statusMessage={statusMessage}
      />

      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onRightClick={handleRightClick}
        visitedNodeIndices={
          visitedNodeIndices
        }
        pathNodeIndices={
          pathNodeIndices
        }
      />

      <Legend />

      <AlgorithmInfoPanel />

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
            setStatusMessage('Ready');
          }}
        />
      )}
    </div>
  );
}

export default App;