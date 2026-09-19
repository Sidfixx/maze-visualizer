import { useState, useLayoutEffect, useRef } from 'react';
import type { Node, AlgorithmResult } from '../types';

export function useAnimationPlayer(
  result: AlgorithmResult | null,
  speed: number = 1,
  onAnimationComplete?: () => void
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

  const completionCallbackRef = useRef(onAnimationComplete);

  useLayoutEffect(() => {
    completionCallbackRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

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
        visitedIntervalRef.current = null;
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
          pathIntervalRef.current = null;

          setIsAnimating(false);

          completionCallbackRef.current?.();
        }
      }, 50 / speed);

      pathIntervalRef.current = pathInterval;
    }

    return () => {
      if (visitedIntervalRef.current) {
        clearInterval(visitedIntervalRef.current);
        visitedIntervalRef.current = null;
      }

      if (pathIntervalRef.current) {
        clearInterval(pathIntervalRef.current);
        pathIntervalRef.current = null;
      }
    };
  }, [result, speed]);

  return {
    visitedNodeIndices,
    pathNodeIndices,
    isAnimating,
  };
}