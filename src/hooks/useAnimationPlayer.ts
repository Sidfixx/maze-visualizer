import { useState, useEffect } from 'react';
import type { Node, AlgorithmResult } from '../types';

export function useAnimationPlayer(
  result: AlgorithmResult | null,
  speed: number = 1 // speed multiplier: 1 = normal, 2 = 2x fast, 0.5 = half speed
) {
  const [visitedNodeIndices, setVisitedNodeIndices] = useState<Set<string>>(new Set());
  const [pathNodeIndices, setPathNodeIndices] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!result) {
      setVisitedNodeIndices(new Set());
      setPathNodeIndices(new Set());
      return;
    }

    setIsAnimating(true);
    let visitedIndex = 0;

    // Animate visited nodes
    const visitedInterval = setInterval(() => {
      if (visitedIndex < result.visitedNodesInOrder.length) {
        const node = result.visitedNodesInOrder[visitedIndex];
        setVisitedNodeIndices(prev => new Set([...prev, `${node.row},${node.col}`]));
        visitedIndex++;
      } else {
        clearInterval(visitedInterval);
        // Once visited is done, start path animation
        animatePath();
      }
    }, 10 / speed); // 10ms per node, adjusted by speed

    function animatePath() {
      let pathIndex = 0;
      const pathInterval = setInterval(() => {
        if (pathIndex < result.shortestPath.length) {
          const node = result.shortestPath[pathIndex];
          setPathNodeIndices(prev => new Set([...prev, `${node.row},${node.col}`]));
          pathIndex++;
        } else {
          clearInterval(pathInterval);
          setIsAnimating(false);
        }
      }, 50 / speed); // 50ms per path node
    }

    return () => {
      clearInterval(visitedInterval);
    };
  }, [result, speed]);

  return { visitedNodeIndices, pathNodeIndices, isAnimating };
}