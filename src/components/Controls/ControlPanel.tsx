import './ControlPanel.css';

interface ControlPanelProps {
  onVisualizeBFS: () => void;
  onVisualizeDFS: () => void;
  onVisualizeDijkstra: () => void;
  onVisualizeAStar: () => void;
  onReset: () => void;
  onGenerateRandomMaze: () => void;
  onGenerateRecursiveBacktracking: () => void;
  onGeneratePrimsMaze: () => void;
  onCompareAlgorithms: () => void;

  isRunning: boolean;
  isAnimating: boolean;
  isComparing: boolean;

  animationSpeed: number;
  onSpeedChange: (speed: number) => void;

  statusMessage: string;
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
  onCompareAlgorithms,
  isRunning,
  isAnimating,
  isComparing,
  animationSpeed,
  onSpeedChange,
  statusMessage,
}: ControlPanelProps) {
  const controlsDisabled =
    isRunning || isAnimating || isComparing;

  const isReady = statusMessage === 'Ready';

  return (
    <aside className="control-panel">
      {/* Header */}
      <div className="control-header">
        <div>
          <span className="control-eyebrow">
            VISUALIZER
          </span>

          <h2 className="control-title">
            Controls
          </h2>
        </div>

        <div className="control-menu-icon">
          ⋮
        </div>
      </div>

      {/* Pathfinding */}
      <section className="control-section">
        <span className="control-section-label">
          Pathfinding Algorithms
        </span>

        <div className="algorithm-buttons">
          <button
            onClick={onVisualizeBFS}
            disabled={controlsDisabled}
            className="control-button control-button-light"
          >
            BFS
          </button>

          <button
            onClick={onVisualizeDFS}
            disabled={controlsDisabled}
            className="control-button control-button-light"
          >
            DFS
          </button>

          <button
            onClick={onVisualizeDijkstra}
            disabled={controlsDisabled}
            className="control-button control-button-light"
          >
            Dijkstra
          </button>

          <button
            onClick={onVisualizeAStar}
            disabled={controlsDisabled}
            className="control-button control-button-light"
          >
            A*
          </button>
        </div>
      </section>

      {/* Maze Generation */}
      <section className="control-section">
        <span className="control-section-label">
          Maze Generation
        </span>

        <div className="maze-buttons">
          <button
            onClick={onGenerateRandomMaze}
            disabled={controlsDisabled}
            className="control-button control-button-outline"
          >
            Random Maze
          </button>

          <button
            onClick={onGenerateRecursiveBacktracking}
            disabled={controlsDisabled}
            className="control-button control-button-outline"
          >
            Recursive Backtracking
          </button>

          <button
            onClick={onGeneratePrimsMaze}
            disabled={controlsDisabled}
            className="control-button control-button-outline"
          >
            Prim's Maze
          </button>
        </div>
      </section>

      {/* Analysis */}
      <section className="control-section">
        <span className="control-section-label">
          Analysis
        </span>

        <button
          onClick={onCompareAlgorithms}
          disabled={controlsDisabled}
          className="control-button control-button-analysis"
        >
          Compare Algorithms
          <span className="button-arrow">
            →
          </span>
        </button>
      </section>

      {/* Speed */}
      <section className="control-section speed-section">
        <div className="speed-header">
          <span className="control-section-label">
            Animation Speed
          </span>

          <span className="speed-value">
            {animationSpeed}/10
          </span>
        </div>

        <div className="speed-control">
          <span className="speed-label">
            Slow
          </span>

          <input
            type="range"
            min="1"
            max="10"
            value={animationSpeed}
            onChange={(e) =>
              onSpeedChange(
                Number(e.target.value)
              )
            }
            className="speed-slider"
          />

          <span className="speed-label">
            Fast
          </span>
        </div>
      </section>

      {/* Status */}
      <section className="control-status">
        <span
          className={`status-dot ${
            isReady
              ? 'status-ready'
              : 'status-active'
          }`}
        />

        <span className="status-message">
          {statusMessage}
        </span>
      </section>

      {/* Reset */}
      <button
        onClick={onReset}
        className="reset-button"
      >
        <span>↻</span>
        Reset Visualizer
      </button>
    </aside>
  );
}