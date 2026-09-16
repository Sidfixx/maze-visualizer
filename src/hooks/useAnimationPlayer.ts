import { useState, useEffect, useRef } from 'react';
import type { Node, AlgorithmResult } from '../types';

export function useAnimationPlayer(
  result: AlgorithmResult | null,
  speed: number = 1
) {
  const [visitedNodeIndices, setVisitedNodeIndices] = useState<Set<string>>(new Set());
  const [pathNodeIndices, setPathNodeIndices] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  
  const visitedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!result) {
      setVisitedNodeIndices(new Set());
      setPathNodeIndices(new Set());
      setIsAnimating(false);
      // Clear any running intervals
      if (visitedIntervalRef.current) clearInterval(visitedIntervalRef.current);
      if (pathIntervalRef.current) clearInterval(pathIntervalRef.current);
      return;
    }

    setIsAnimating(true);
    let visitedIndex = 0;

    const visitedInterval = setInterval(() => {
      if (visitedIndex < result.visitedNodesInOrder.length) {
        const node = result.visitedNodesInOrder[visitedIndex];
        setVisitedNodeIndices(prev => new Set([...prev, `${node.row},${node.col}`]));
        visitedIndex++;
      } else {
        clearInterval(visitedInterval);
        animatePath();
      }
    }, 10 / speed);

    visitedIntervalRef.current = visitedInterval;

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
      }, 50 / speed);

      pathIntervalRef.current = pathInterval;
    }

    return () => {
      if (visitedIntervalRef.current) clearInterval(visitedIntervalRef.current);
      if (pathIntervalRef.current) clearInterval(pathIntervalRef.current);
    };
  }, [result, speed]);

  return { visitedNodeIndices, pathNodeIndices, isAnimating };
}