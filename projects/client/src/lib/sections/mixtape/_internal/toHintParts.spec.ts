import { describe, expect, it } from 'vitest';
import { toHintParts } from './toHintParts.ts';

describe('toHintParts', () => {
  it('should mark the direction words for emphasis', () => {
    const parts = toHintParts({
      format: ({ right, left }) => `Swipe ${right} to keep, ${left} to pass`,
      right: 'right',
      left: 'left',
    });

    expect(parts).toEqual([
      { text: 'Swipe ', isEmphasis: false },
      { text: 'right', isEmphasis: true },
      { text: ' to keep, ', isEmphasis: false },
      { text: 'left', isEmphasis: true },
      { text: ' to pass', isEmphasis: false },
    ]);
  });

  it('should follow the word order of the translation', () => {
    const parts = toHintParts({
      format: ({ right, left }) => `${left} / ${right}`,
      right: 'R',
      left: 'L',
    });

    expect(parts.map(({ text }) => text)).toEqual(['L', ' / ', 'R']);
  });
});
