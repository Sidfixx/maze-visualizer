export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  previousNode: Node | null;
}
export interface AlgorithmResult {
  visitedNodesInOrder: Node[];
  shortestPath: Node[];
}