import { describe, expect, it } from 'vitest';
import { toTypingFrames } from './toTypingFrames.ts';

const timing = { characterDelay: 10, linePause: 100, endPause: 1000 };

describe('util: toTypingFrames', () => {
  it('should type each line one character at a time', () => {
    const frames = toTypingFrames({ lines: ['Hi', 'Yo'], ...timing });

    expect(frames.map((frame) => frame.typed)).toEqual([
      ['H'],
      ['Hi'],
      ['Hi', 'Y'],
      ['Hi', 'Yo'],
    ]);
  });

  it('should pause after each line and longer at the end', () => {
    const frames = toTypingFrames({ lines: ['Hi', 'Yo'], ...timing });

    expect(frames.map((frame) => frame.wait)).toEqual([10, 110, 10, 1110]);
  });

  it('should show everything at once without motion', () => {
    expect(
      toTypingFrames({ lines: ['Hi', 'Yo'], ...timing, characterDelay: 0 }),
    ).toEqual([{ typed: ['Hi', 'Yo'], wait: 0 }]);
  });

  it('should only wait when there is nothing to type', () => {
    expect(toTypingFrames({ lines: [], ...timing })).toEqual([
      { typed: [], wait: 1000 },
    ]);
  });
});
