export type TGameState = {
  cells: TCell[][];
  height: number;
  width: number;
  generation: number;
};

export type TCell = 0 | 1;
