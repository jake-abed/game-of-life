import { useEffect, useState } from "react";
import { advanceGeneration, createNewRandomCells } from "./game-of-life";
import type { TGameState } from "./types";
import "./App.css";

const DEFAULT_WIDTH = 32;
const DEFAULT_HEIGHT = 24;

function App() {
  const [isStopped, setIsStopped] = useState(true);
  const [boardSize, setBoardSize] = useState<[height: number, width: number]>([
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
  ]);
  const [gameState, setGameState] = useState<TGameState>({
    height: boardSize[0],
    width: boardSize[1],
    cells: createNewRandomCells(DEFAULT_HEIGHT, DEFAULT_WIDTH, 0.35),
    generation: 0,
  });

  useEffect(() => {
    let intervalId: number;
    if (!isStopped) {
      intervalId = setInterval(() => {
        setGameState((prevState) => advanceGeneration(prevState));
      }, 50);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStopped]);

  function handleStartStop() {
    setIsStopped(!isStopped);
  }

  function changeHeight(e: React.ChangeEvent<HTMLInputElement>) {
    const newHeight = Number(e.target.value);
    if (
      newHeight < 10 ||
      newHeight > 36 ||
      newHeight === boardSize[0] ||
      isNaN(newHeight)
    )
      return;
    setBoardSize([newHeight, boardSize[1]]);
  }

  function changeWidth(e: React.ChangeEvent<HTMLInputElement>) {
    const newWidth = Number(e.target.value);
    if (
      newWidth < 16 ||
      newWidth > 48 ||
      newWidth === boardSize[1] ||
      isNaN(newWidth)
    )
      return;
    setBoardSize([boardSize[0], newWidth]);
  }

  function resetGame(newH: number = boardSize[0], newW: number = boardSize[1]) {
    setIsStopped(true);
    setGameState({
      height: newH,
      width: newW,
      cells: createNewRandomCells(boardSize[0], boardSize[1], 0.35),
      generation: 0,
    });
  }

  function toggleCell(
    e: React.PointerEvent<HTMLDivElement>,
    x: number,
    y: number,
  ) {
    if (e.buttons === 0) return;
    const oldValue = gameState.cells[y][x];
    const newCells = structuredClone(gameState.cells);
    newCells[y][x] = oldValue === 1 ? 0 : 1;

    setGameState({
      ...gameState,
      cells: newCells,
    });
  }

  return (
    <div className="flex flex-col h-fit gap-8 justify-center items-center">
      <div className="flex gap-4">
        <button type="button" onClick={handleStartStop}>
          {isStopped ? "Start" : "Stop"}
        </button>
        <button type="button" onClick={() => resetGame()}>
          Reset Game
        </button>
        <label className="flex gap-2 items-center " htmlFor="height">
          Height: {boardSize[0]}
          <input
            disabled={!isStopped}
            className="bg-white text-zinc-900 rounded-sm p-2"
            type="range"
            step={1}
            min={10}
            max={36}
            id="height"
            name="height"
            value={boardSize[0]}
            onChange={changeHeight}
          />
        </label>
        <label className="flex gap-2 items-center " htmlFor="width">
          Width: {boardSize[1]}
          <input
            disabled={!isStopped}
            className="bg-white text-zinc-900 rounded-sm p-2"
            type="range"
            step={1}
            min={16}
            max={48}
            id="width"
            name="width"
            value={boardSize[1]}
            onChange={changeWidth}
          />
        </label>
      </div>
      <div
        className="box-border max-w-[800px] grid grid-flow-row select-none gap-0 w-full h-full"
        draggable={false}
        style={
          {
            "--columns": gameState.width,
            "--rows": gameState.height,
            gridTemplateColumns: `repeat(${gameState.width}, 1fr)`,
            gridTemplateRows: `repeat(${gameState.height}, 1fr)`,
          } as React.CSSProperties
        }
      >
        {gameState.cells.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              draggable={false}
              onPointerDown={
                isStopped
                  ? (e) => toggleCell(e, cellIndex, rowIndex)
                  : undefined
              }
              onPointerEnter={
                isStopped
                  ? (e) => toggleCell(e, cellIndex, rowIndex)
                  : undefined
              }
              key={`cell-${rowIndex}-${cellIndex}`}
              className={`box-border border border-zinc-100 select-none aspect-square ${cell === 1 ? "bg-black" : "bg-zinc-300"} ${isStopped ? "hover:border hover:border-rose-800" : ""}`}
            ></div>
          )),
        )}
      </div>
      <div>Hi generation {gameState.generation}!</div>
    </div>
  );
}

export default App;
