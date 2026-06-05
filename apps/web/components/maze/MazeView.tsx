"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";

export interface MazeConfig {
  rows: number;
  cols: number;
  grid: number[][];
  startX: number;
  startY: number;
  startDir: "N" | "E" | "S" | "W";
  goalX: number;
  goalY: number;
}

export interface MazeHandle {
  run: (code: string) => void;
  reset: () => void;
}

type Dir = "N" | "E" | "S" | "W";

const DIR_DELTA: Record<Dir, [number, number]> = {
  N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0],
};
const TURN_LEFT: Record<Dir, Dir> = { N: "W", W: "S", S: "E", E: "N" };
const TURN_RIGHT: Record<Dir, Dir> = { N: "E", E: "S", S: "W", W: "N" };
const DIR_ROTATE: Record<Dir, number> = { N: -90, E: 0, S: 90, W: 180 };

type Status = "idle" | "running" | "won" | "lost";

interface CharState {
  x: number;
  y: number;
  dir: Dir;
  status: Status;
}

function computeSteps(config: MazeConfig, code: string): CharState[] {
  const steps: CharState[] = [];
  let x = config.startX, y = config.startY, dir: Dir = config.startDir;

  function moveForward() {
    const [dx, dy] = DIR_DELTA[dir];
    const nx = x + dx, ny = y + dy;
    const hitWall =
      nx < 0 || nx >= config.cols ||
      ny < 0 || ny >= config.rows ||
      config.grid[ny]?.[nx] === 1;
    if (!hitWall) { x = nx; y = ny; }
    const won = x === config.goalX && y === config.goalY;
    // only mark "lost" for actual wall tiles, not out-of-bounds overshoot
    const isWallTile = !hitWall ? false : config.grid[ny]?.[nx] === 1;
    steps.push({ x, y, dir, status: won ? "won" : isWallTile ? "lost" : "running" });
  }

  function turnLeft() {
    dir = TURN_LEFT[dir];
    steps.push({ x, y, dir, status: "running" });
  }

  function turnRight() {
    dir = TURN_RIGHT[dir];
    steps.push({ x, y, dir, status: "running" });
  }

  try {
    // eslint-disable-next-line no-new-func
    new Function("maze_moveForward", "maze_turnLeft", "maze_turnRight", code)(
      moveForward, turnLeft, turnRight
    );
  } catch {
    // ignore runtime errors
  }

  return steps;
}

const MazeView = forwardRef<MazeHandle, { config: MazeConfig }>(({ config }, ref) => {
  const [char, setChar] = useState<CharState>({
    x: config.startX,
    y: config.startY,
    dir: config.startDir,
    status: "idle",
  });

  const reset = useCallback(() => {
    setChar({ x: config.startX, y: config.startY, dir: config.startDir, status: "idle" });
  }, [config]);

  const run = useCallback((code: string) => {
    const steps = computeSteps(config, code);

    // Always reset to start before animating
    setChar({ x: config.startX, y: config.startY, dir: config.startDir, status: "running" });

    if (steps.length === 0) {
      setChar(s => ({ ...s, status: "idle" }));
      return;
    }

    let i = 0;

    const interval = setInterval(() => {
      setChar(steps[i]);
      if (steps[i].status === "won" || steps[i].status === "lost") {
        clearInterval(interval);
        return;
      }
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setChar(s => ({ ...s, status: s.status === "running" ? "idle" : s.status }));
      }
    }, 450);
  }, [config]);

  useImperativeHandle(ref, () => ({ run, reset }));

  const cellSize = Math.min(52, Math.floor(360 / Math.max(config.rows, config.cols)));

  return (
    <div className="flex flex-col items-center gap-3 p-4 h-full justify-center">
      {char.status === "won" && (
        <div className="bg-green-100 border border-green-300 text-green-800 font-bold px-4 py-2 rounded-xl text-sm">
          🎉 آفرین! به ستاره رسیدی!
        </div>
      )}
      {char.status === "lost" && (
        <div className="bg-red-100 border border-red-300 text-red-800 font-bold px-4 py-2 rounded-xl text-sm">
          💥 به دیوار خوردی! دوباره امتحان کن.
        </div>
      )}

      <div
        className="border-2 border-gray-400 rounded-lg overflow-hidden shadow-md"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${config.rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: config.rows }, (_, row) =>
          Array.from({ length: config.cols }, (_, col) => {
            const isChar = char.x === col && char.y === row;
            const isGoal = config.goalX === col && config.goalY === row && !isChar;
            const isWall = config.grid[row]?.[col] === 1;
            const fontSize = cellSize * 0.55;

            return (
              <div
                key={`${row}-${col}`}
                style={{ width: cellSize, height: cellSize, fontSize }}
                className={`flex items-center justify-center border border-gray-200 transition-colors ${
                  isWall
                    ? "bg-gray-700"
                    : char.status === "won" && isChar
                    ? "bg-yellow-100"
                    : "bg-green-50"
                }`}
              >
                {isChar ? (
                  <span
                    style={{
                      transform: `rotate(${DIR_ROTATE[char.dir]}deg)`,
                      display: "inline-block",
                      transition: "transform 0.3s",
                      fontSize,
                    }}
                  >
                    🤖
                  </span>
                ) : isGoal ? (
                  <span style={{ fontSize }}>⭐</span>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-gray-400">
        موقعیت: ({char.x}, {char.y})
      </p>
    </div>
  );
});

MazeView.displayName = "MazeView";
export default MazeView;
