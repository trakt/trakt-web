import { describe, expect, it } from 'vitest';
import { applyPendingReactions } from './applyPendingReactions.ts';

const snapshot = {
  held: ['fire' as const],
  distribution: { fire: 3, skull: 1 },
  totalCount: 4,
};

const tap = (isPresent: boolean, isSettled = false) => ({
  isPresent,
  isSettled,
});

describe('util: applyPendingReactions', () => {
  it('should leave the snapshot alone without pending taps', () => {
    const result = applyPendingReactions({ ...snapshot, pending: {} });

    expect(result.chosen).toEqual(['fire']);
    expect(result.locked).toEqual([]);
    expect(result.totalCount).toBe(4);
  });

  it('should show a pending add and lock it until it settles', () => {
    const result = applyPendingReactions({
      ...snapshot,
      pending: { skull: tap(true) },
    });

    expect(result.chosen).toEqual(['fire', 'skull']);
    expect(result.locked).toEqual(['skull']);
    expect(result.distribution.skull).toBe(2);
    expect(result.totalCount).toBe(5);
  });

  it('should hide a pending remove', () => {
    const result = applyPendingReactions({
      ...snapshot,
      pending: { fire: tap(false) },
    });

    expect(result.chosen).toEqual([]);
    expect(result.distribution.fire).toBe(2);
    expect(result.totalCount).toBe(3);
  });

  it('should keep a settled tap applied but unlocked', () => {
    const result = applyPendingReactions({
      ...snapshot,
      pending: { skull: tap(true, true) },
    });

    expect(result.chosen).toEqual(['fire', 'skull']);
    expect(result.locked).toEqual([]);
    expect(result.totalCount).toBe(5);
  });

  it('should cancel out an add and a remove of the same reaction', () => {
    const result = applyPendingReactions({
      ...snapshot,
      pending: { skull: tap(false, true) },
    });

    expect(result.chosen).toEqual(['fire']);
    expect(result.distribution.skull).toBe(1);
    expect(result.totalCount).toBe(4);
  });

  it('should rank the top reactions on the adjusted counts', () => {
    const result = applyPendingReactions({
      held: [],
      distribution: { fire: 1, skull: 1 },
      totalCount: 2,
      pending: { skull: tap(true) },
    });

    expect(result.top.at(0)).toBe('skull');
  });
});
