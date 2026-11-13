import { describe, expect, it } from 'vitest';
import { toMixState } from './toMixState.ts';

describe('toMixState', () => {
  it('should wait for a first pick', () => {
    expect(
      toMixState({ count: 0, max: 5, view: 'pick', isMixing: false }),
    ).toBe('empty');
  });

  it('should offer the mix as soon as something is picked', () => {
    expect(
      toMixState({ count: 2, max: 5, view: 'pick', isMixing: false }),
    ).toBe('picking');
  });

  it('should light up once the deck is full', () => {
    expect(
      toMixState({ count: 5, max: 5, view: 'pick', isMixing: false }),
    ).toBe('ready');
  });

  it('should show the mixing hold over everything else', () => {
    expect(
      toMixState({ count: 5, max: 5, view: 'results', isMixing: true }),
    ).toBe('mixing');
  });

  it('should offer a remix once the results are in', () => {
    expect(
      toMixState({ count: 3, max: 5, view: 'results', isMixing: false }),
    ).toBe('done');
  });
});
