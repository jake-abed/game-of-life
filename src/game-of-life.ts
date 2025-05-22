import type { TGameState, TCell } from "./types";

export function initGame(
  height: number,
  width: number,
  board: Array<Array<TCell>>,
) {
  return {
    height,
    width,
    cells: board,
    generation: 0,
  } as TGameState;
}

export function advanceGeneration(game: TGameState): TGameState {
  const nextGen = createEmptyCells(game.height, game.width);
  const newGameState: TGameState = {
    width: game.width,
    height: game.height,
    cells: [[]],
    generation: game.generation + 1,
  };

  for (let y = 0; y < game.cells.length; y++) {
    for (let x = 0; x < game.cells[y].length; x++) {
      nextGen[y][x] = processCell(game, x, y);
    }
  }

  newGameState.cells = nextGen;

  return newGameState;
}

function processCell(game: TGameState, x: number, y: number): TCell {
  console.log(x, y);
  const NW = x !== 0 && y !== 0 ? game.cells[y - 1][x - 1] : 0;
  const N = y !== 0 ? game.cells[y - 1][x] : 0;
  const NE = y !== 0 && x !== game.width - 1 ? game.cells[y - 1][x + 1] : 0;
  const E = x !== game.width - 1 ? game.cells[y][x + 1] : 0;
  const SE =
    x !== game.width - 1 && y !== game.height - 1
      ? game.cells[y + 1][x + 1]
      : 0;
  const S = y !== game.height - 1 ? game.cells[y + 1][x] : 0;
  const SW = x !== 0 && y !== game.height - 1 ? game.cells[y + 1][x - 1] : 0;
  const W = x !== 0 ? game.cells[y][x - 1] : 0;

  const sum = NW + N + NE + E + SE + S + SW + W;

  switch (sum) {
    case 0:
      return 0;
    case 1:
      return 0;
    case 2:
      return game.cells[y][x] === 1 ? 1 : 0;
    case 3:
      return 1;
    default:
      return 0;
  }
}

function createEmptyCells(height: number, width: number): TCell[][] {
  const cells: TCell[][] = [[]];

  for (let i = 0; i < height; i++) {
    const newRow: TCell[] = [];
    for (let j = 0; j < width; j++) {
      newRow[j] = 0;
    }

    cells[i] = newRow;
  }

  return cells;
}

function fillRandomCells(cells: TCell[][], probability: number): TCell[][] {
  const newCells = [...cells];

  for (let i = 0; i < newCells.length; i++) {
    for (let j = 0; j < newCells[i].length; j++) {
      newCells[i][j] = Math.random() < probability ? 1 : 0;
    }
  }

  return newCells;
}

export function createNewRandomCells(
  height: number,
  width: number,
  probability: number,
): TCell[][] {
  const cells = createEmptyCells(height, width);
  return fillRandomCells(cells, probability);
}
