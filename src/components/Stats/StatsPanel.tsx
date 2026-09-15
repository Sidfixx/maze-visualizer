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
      <h3>Algorithm: {stats.algorithm}</h3>
      <div className="stat-item">
        <span className="stat-label">Nodes Visited:</span>
        <span className="stat-value">{stats.nodesVisited}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Path Length:</span>
        <span className="stat-value">{stats.pathLength}</span>
      </div>
    </div>
  );
}