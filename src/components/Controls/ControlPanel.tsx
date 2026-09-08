interface ControlPanelProps {
  onVisualizeBFS: () => void;
  onVisualizeDFS: () => void;
  onVisualizeDijkstra: () => void;
  onReset: () => void;
  isRunning: boolean;
  isAnimating: boolean;
}

export function ControlPanel({
  onVisualizeBFS,
  onVisualizeDFS,
  onVisualizeDijkstra,
  onReset,
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
      <button onClick={onReset} className="btn btn-secondary">
        Reset
      </button>
    </div>
  );
}