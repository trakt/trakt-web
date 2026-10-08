type TypingFrame = {
  typed: ReadonlyArray<string>;
  wait: number;
};

type ToTypingFramesParams = {
  lines: ReadonlyArray<string>;
  characterDelay: number;
  linePause: number;
  endPause: number;
};

function lineFrames(
  { lines, index, characterDelay, linePause }: {
    lines: ReadonlyArray<string>;
    index: number;
    characterDelay: number;
    linePause: number;
  },
): ReadonlyArray<TypingFrame> {
  const line = lines.at(index) ?? '';
  const previous = lines.slice(0, index);

  return Array.from(line, (_, i) => ({
    typed: [...previous, line.slice(0, i + 1)],
    wait: i === line.length - 1 ? characterDelay + linePause : characterDelay,
  }));
}

export function toTypingFrames(
  { lines, characterDelay, linePause, endPause }: ToTypingFramesParams,
): ReadonlyArray<TypingFrame> {
  if (characterDelay === 0) return [{ typed: lines, wait: 0 }];

  const frames = lines.flatMap((_, index) =>
    lineFrames({ lines, index, characterDelay, linePause })
  );
  const last = frames.at(-1) ?? { typed: [], wait: 0 };

  return [...frames.slice(0, -1), { ...last, wait: last.wait + endPause }];
}
