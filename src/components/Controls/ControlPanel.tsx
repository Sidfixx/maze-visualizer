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
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
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
  animationSpeed,
  onSpeedChange,
}: ControlPanelProps) {
  const controlsDisabled = isRunning || isAnimating;

  return (
    <div className="control-panel">
      {/* Pathfinding Algorithms */}
      <div className="control-section">
        <h2 className="control-section-title">
          Pathfinding Algorithms
        </h2>

        <div className="control-group">
          <button
            onClick={onVisualizeBFS}
            disabled={controlsDisabled}
            className="btn btn-primary"
          >
            BFS
          </button>

          <button
            onClick={onVisualizeDFS}
            disabled={controlsDisabled}
            className="btn btn-primary"
          >
            DFS
          </button>

          <button
            onClick={onVisualizeDijkstra}
            disabled={controlsDisabled}
            className="btn btn-primary"
          >
            Dijkstra
          </button>

          <button
            onClick={onVisualizeAStar}
            disabled={controlsDisabled}
            className="btn btn-primary"
          >
            A*
          </button>
        </div>
      </div>

      {/* Maze Generation */}
      <div className="control-section">
        <h2 className="control-section-title">
          Maze Generation
        </h2>

        <div className="control-group">
          <button
            onClick={onGenerateRandomMaze}
            disabled={controlsDisabled}
            className="btn btn-maze"
          >
            Random Maze
          </button>

          <button
            onClick={onGenerateRecursiveBacktracking}
            disabled={controlsDisabled}
            className="btn btn-maze"
          >
            Recursive Backtracking
          </button>

          <button
            onClick={onGeneratePrimsMaze}
            disabled={controlsDisabled}
            className="btn btn-maze"
          >
            Prim's Maze
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="control-section speed-section">
        <h2 className="control-section-title">
          Animation Speed
        </h2>

        <div className="speed-control">
          <span className="speed-label">Slow</span>

          <input
            type="range"
            min="1"
            max="10"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="speed-slider"
          />

          <span className="speed-label">Fast</span>
        </div>

        <span className="speed-value">
          {animationSpeed}/10
        </span>
      </div>

      {/* Reset */}
      <div className="control-section control-section-actions">
        <button
          onClick={onReset}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>
    </div>
  );
}