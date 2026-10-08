import { describe, expect, it } from 'vitest';
import { toVersusState } from './toVersusState.ts';

describe('util: toVersusState', () => {
  it('should be idle while guessing', () => {
    expect(toVersusState({ phase: 'guess', result: null })).toBe('idle');
  });

  it('should reveal while the rating rolls', () => {
    expect(toVersusState({ phase: 'reveal', result: null })).toBe('reveal');
  });

  it('should show the result after the reveal', () => {
    expect(toVersusState({ phase: 'result', result: 'hit' })).toBe('hit');
    expect(toVersusState({ phase: 'over', result: 'miss' })).toBe('miss');
  });

  it('should go back to idle while advancing', () => {
    expect(toVersusState({ phase: 'advance', result: 'hit' })).toBe('idle');
  });
});
