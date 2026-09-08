export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  previousNode: Node | null;
  distance: number;
  weight: number;
}
export interface AlgorithmResult {
  visitedNodesInOrder: Node[];
  shortestPath: Node[];
}