import { useState, useLayoutEffect, useRef } from 'react';
import type { AlgorithmResult } from '../types';

import {
  startSearchSound,
  stopSearchSound,
  playPathFoundSound,
  startPathTravelSound,
  stopPathTravelSound,
  stopAllSounds,
} from '../utils/soundEffects';

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

      stopAllSounds();

      return;
    }

    const currentResult = result;

    setIsAnimating(true);
    setVisitedNodeIndices(new Set());
    setPathNodeIndices(new Set());

    /*
     * PHASE 1
     * Algorithm explores the grid.
     */
    startSearchSound();

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

        /*
         * Search is complete.
         */
        stopSearchSound();

        /*
         * Play the short "path found" blink.
         */
        if (currentResult.shortestPath.length > 0) {
          playPathFoundSound();
        }

        /*
         * Start the path travel sound slightly
         * after the path-found sound.
         */
        setTimeout(() => {
          animatePath();
        }, 150);
      }
    }, 10 / speed);

    visitedIntervalRef.current = visitedInterval;

    /*
     * PHASE 2
     * Animate the shortest path.
     */
    function animatePath() {
      let pathIndex = 0;

      if (currentResult.shortestPath.length > 0) {
        startPathTravelSound();
      }

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

          stopPathTravelSound();

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

      stopAllSounds();
    };
  }, [result, speed]);

  return {
    visitedNodeIndices,
    pathNodeIndices,
    isAnimating,
  };
}