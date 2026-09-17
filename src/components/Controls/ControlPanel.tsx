interface ControlPanelProps {
  onVisualizeBFS: () => void;
  onVisualizeDFS: () => void;
  onVisualizeDijkstra: () => void;
  onVisualizeAStar: () => void;
  onReset: () => void;
  onGenerateRandomMaze: () => void;
  onGenerateRecursiveBacktracking: () => void;
  onGeneratePrimsMaze: () => void;
  isRunning: boolean;
  isAnimating: boolean;
}

export function ControlPanel({
  onVisualizeBFS,
  onVisualizeDFS,
  onVisualizeDijkstra,
  onVisualizeAStar,
  onReset,
  onGenerateRandomMaze,
  onGenerateRecursiveBacktracking,
  onGeneratePrimsMaze,
  isRunning,
  isAnimating,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <button
        onClick={onVisualizeBFS}
        disabled={isRunning || isAnimating}
        className="btn btn-primary"
      >
        Visualize BFS
      </button>
      <button
        onClick={onVisualizeDFS}
        disabled={isRunning || isAnimating}
        className="btn btn-primary"
      >
        Visualize DFS
      </button>
      <button
        onClick={onVisualizeDijkstra}
        disabled={isRunning || isAnimating}
        className="btn btn-primary"
      >
        Visualize Dijkstra
      </button>
      <button
        onClick={onVisualizeAStar}
        disabled={isRunning || isAnimating}
        className="btn btn-primary"
      >
        Visualize A*
      </button>
      <button onClick={onReset} className="btn btn-secondary">
        Reset
      </button>

      {/* ── Maze Generation ───────────────────────────────── */}
      <div className="control-divider" />
      <button
        onClick={onGenerateRandomMaze}
        disabled={isRunning || isAnimating}
        className="btn btn-maze"
      >
        Random Maze
      </button>
      <button
        onClick={onGenerateRecursiveBacktracking}
        disabled={isRunning || isAnimating}
        className="btn btn-maze"
      >
        Recursive Backtracking
      </button>
      <button
        onClick={onGeneratePrimsMaze}
        disabled={isRunning || isAnimating}
        className="btn btn-maze"
      >
        Prim's Maze
      </button>
    </div>
  );
}