import type { AlgorithmResult } from '../../types';
import './ComparisonPanel.css';

interface ComparisonPanelProps {
  results: AlgorithmResult[];
  onClear: () => void;
}

export function ComparisonPanel({
  results,
  onClear,
}: ComparisonPanelProps) {
  if (results.length === 0) {
    return null;
  }

  // Sort only for display.
  // This does NOT change the order in which algorithms were animated.
  const sortedResults = [...results].sort(
    (a, b) =>
      (a.stats?.executionTime ?? Infinity) -
      (b.stats?.executionTime ?? Infinity)
  );

  return (
    <div className="comparison-panel">
      <div className="comparison-header">
        <h2 className="comparison-title">
          Algorithm Comparison
        </h2>

        <button
          onClick={onClear}
          className="btn btn-secondary comparison-clear"
        >
          Clear Comparison
        </button>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Nodes Visited</th>
              <th>Path Length</th>
              <th>Execution Time</th>
            </tr>
          </thead>

          <tbody>
            {sortedResults.map((result) => (
              <tr key={result.stats?.algorithm}>
                <td className="comparison-algorithm">
                  {result.stats?.algorithm}
                </td>

                <td>
                  {result.stats?.nodesVisited}
                </td>

                <td>
                  {result.stats?.pathLength === 0
                    ? 'No path'
                    : result.stats?.pathLength}
                </td>

                <td>
                  {result.stats?.executionTime.toFixed(2)} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}