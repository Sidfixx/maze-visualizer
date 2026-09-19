import { useState } from 'react';
import './AlgorithmInfoPanel.css';

type AlgorithmName = 'BFS' | 'DFS' | 'Dijkstra' | 'A*';

interface AlgorithmInfo {
  name: AlgorithmName;
  fullName: string;
  description: string;
  howItWorks: string;
  type: string;
  shortestPath: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const algorithmInfo: AlgorithmInfo[] = [
  {
    name: 'BFS',
    fullName: 'Breadth-First Search',
    description:
      'Explores the grid level by level using a queue. It guarantees the shortest path when all edges have equal weight.',
    howItWorks:
      'BFS starts at the start node and explores all neighboring nodes before moving to the next level. A queue keeps track of the nodes waiting to be explored.',
    type: 'Unweighted',
    shortestPath: 'Yes',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    name: 'DFS',
    fullName: 'Depth-First Search',
    description:
      'Explores as deeply as possible before backtracking. It can find a path, but it does not guarantee the shortest path.',
    howItWorks:
      'DFS follows one path as deeply as possible. When it reaches a dead end, it backtracks and tries another path.',
    type: 'Unweighted',
    shortestPath: 'No',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  {
    name: 'Dijkstra',
    fullName: "Dijkstra's Algorithm",
    description:
      'Repeatedly explores the node with the smallest known distance. It guarantees the shortest path when edge weights are non-negative.',
    howItWorks:
      'Dijkstra assigns a distance to every node and repeatedly chooses the node with the smallest known distance. It then updates the distances of its neighbors.',
    type: 'Weighted',
    shortestPath: 'Yes',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  },
  {
    name: 'A*',
    fullName: 'A* Search',
    description:
      'Combines the cost already travelled with a heuristic estimate of the remaining distance to guide the search toward the goal.',
    howItWorks:
      'A* evaluates nodes using the cost already travelled plus an estimate of the remaining distance. This helps guide the search toward the destination instead of exploring uniformly.',
    type: 'Weighted',
    shortestPath: 'Yes*',
    timeComplexity: 'Depends on heuristic',
    spaceComplexity: 'O(V)',
  },
];

export function AlgorithmInfoPanel() {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmName>('BFS');

  const selectedInfo = algorithmInfo.find(
    (algorithm) => algorithm.name === selectedAlgorithm
  )!;

  return (
    <div className="algorithm-info-panel">
      <h2 className="algorithm-info-title">
        Algorithm Information
      </h2>

      <p className="algorithm-selector-label">
        Learn about:
      </p>

      <div className="algorithm-selector">
        {algorithmInfo.map((algorithm) => (
          <button
            key={algorithm.name}
            onClick={() => setSelectedAlgorithm(algorithm.name)}
            className={`algorithm-info-button ${
              selectedAlgorithm === algorithm.name
                ? 'active'
                : ''
            }`}
          >
            {algorithm.name}
          </button>
        ))}
      </div>

      <div className="algorithm-info-content">
        <h3>{selectedInfo.fullName}</h3>

        <p className="algorithm-description">
          {selectedInfo.description}
        </p>

        <div className="algorithm-how-it-works">
          <h4>How it works</h4>

          <p>{selectedInfo.howItWorks}</p>
        </div>

        <div className="algorithm-details">
          <div className="algorithm-detail">
            <span>Type</span>
            <strong>{selectedInfo.type}</strong>
          </div>

          <div className="algorithm-detail">
            <span>Shortest Path</span>
            <strong>{selectedInfo.shortestPath}</strong>
          </div>

          <div className="algorithm-detail">
            <span>Time Complexity</span>
            <strong>{selectedInfo.timeComplexity}</strong>
          </div>

          <div className="algorithm-detail">
            <span>Space Complexity</span>
            <strong>{selectedInfo.spaceComplexity}</strong>
          </div>
        </div>

        {selectedAlgorithm === 'A*' && (
          <p className="algorithm-note">
            * With an admissible heuristic such as Manhattan
            distance for this grid, A* can guarantee an optimal
            path under the appropriate conditions.
          </p>
        )}
      </div>
    </div>
  );
}