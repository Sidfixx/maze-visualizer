import { useState, useLayoutEffect, useRef } from 'react';
import type { AlgorithmResult } from '../types';

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

  const visitedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const pathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const completionCallbackRef = useRef(onAnimationComplete);

  completionCallbackRef.current = onAnimationComplete;

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

    /*
     * Store the non-null result locally.
     * This prevents TypeScript from thinking result
     * might become null inside the nested function.
     */
    const currentResult = result;

    setIsAnimating(true);
    setVisitedNodeIndices(new Set());
    setPathNodeIndices(new Set());

    let visitedIndex = 0;

    const visitedInterval = setInterval(() => {
      if (
        visitedIndex <
        currentResult.visitedNodesInOrder.length
      ) {
        const node =
          currentResult.visitedNodesInOrder[visitedIndex];

        setVisitedNodeIndices((previous) => {
          const next = new Set(previous);

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
        if (
          pathIndex <
          currentResult.shortestPath.length
        ) {
          const node =
            currentResult.shortestPath[pathIndex];

          setPathNodeIndices((previous) => {
            const next = new Set(previous);

            next.add(`${node.row},${node.col}`);

            return next;
          });

          pathIndex++;
        } else {
          clearInterval(pathInterval);

          setIsAnimating(false);

          completionCallbackRef.current?.();
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