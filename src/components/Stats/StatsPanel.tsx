import type { AlgorithmStats } from '../../types';
import './StatsPanel.css';

interface StatsPanelProps {
  stats: AlgorithmStats | undefined;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) {
    return null;
  }

  return (
    <div className="stats-panel">
      <h2 className="stats-title">Algorithm Statistics</h2>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Algorithm</span>
          <span className="stat-value">{stats.algorithm}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Nodes Visited</span>
          <span className="stat-value">{stats.nodesVisited}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Path Length</span>
          <span className="stat-value">
          {stats.pathLength === 0 ? 'No path found' : stats.pathLength}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Execution Time</span>
          <span className="stat-value">
            {stats.executionTime.toFixed(2)} ms
          </span>
        </div>
      </div>
    </div>
  );
}