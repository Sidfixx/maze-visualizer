interface ControlPanelProps {
  onVisualize: () => void;
  onReset: () => void;
  isRunning: boolean;
  isAnimating: boolean;
}

export function ControlPanel({
  onVisualize,
  onReset,
  isRunning,
  isAnimating,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <button
        onClick={onVisualize}
        disabled={isRunning || isAnimating}
        className="btn btn-primary"
      >
        {isRunning ? 'Running...' : isAnimating ? 'Animating...' : 'Visualize BFS'}
      </button>
      <button onClick={onReset} className="btn btn-secondary">
        Reset
      </button>
    </div>
  );
}