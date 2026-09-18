import { useState, useLayoutEffect, useRef } from 'react';
import type { Node, AlgorithmResult } from '../types';

export function useAnimationPlayer(
  result: AlgorithmResult | null,
  speed: number = 1
) {
  const [visitedNodeIndices, setVisitedNodeIndices] = useState<Set<string>>(
    new Set()
  );

  const [pathNodeIndices, setPathNodeIndices] = useState<Set<string>>(
    new Set()
  );

  const [isAnimating, setIsAnimating] = useState(false);

  const visitedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    if (!result) {
      setVisitedNodeIndices(new Set());
      setPathNodeIndices(new Set());
      setIsAnimating(false);

      if (visitedIntervalRef.current) {
        clearInterval(visitedIntervalRef.current);
      }

      if (pathIntervalRef.current) {
        clearInterval(pathIntervalRef.current);
      }

      return;
    }

    // Start animation before the browser paints
    setIsAnimating(true);
    setVisitedNodeIndices(new Set());
    setPathNodeIndices(new Set());

    let visitedIndex = 0;

    const visitedInterval = setInterval(() => {
      if (visitedIndex < result.visitedNodesInOrder.length) {
        const node = result.visitedNodesInOrder[visitedIndex];

        setVisitedNodeIndices((prev) => {
          const next = new Set(prev);
          next.add(`${node.row},${node.col}`);
          return next;
        });

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

          setPathNodeIndices((prev) => {
            const next = new Set(prev);
            next.add(`${node.row},${node.col}`);
            return next;
          });

          pathIndex++;
        } else {
          clearInterval(pathInterval);
          setIsAnimating(false);
        }
      }, 50 / speed);

      pathIntervalRef.current = pathInterval;
    }

    return () => {
      if (visitedIntervalRef.current) {
        clearInterval(visitedIntervalRef.current);
      }

      if (pathIntervalRef.current) {
        clearInterval(pathIntervalRef.current);
      }
    };
  }, [result, speed]);

  return {
    visitedNodeIndices,
    pathNodeIndices,
    isAnimating,
  };
}