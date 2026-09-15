import { describe, expect, it } from 'vitest';
import { toWatchedGapPrompt } from './toWatchedGapPrompt.ts';

const prompt = (
  props: Partial<Parameters<typeof toWatchedGapPrompt>[0]> = {},
) =>
  toWatchedGapPrompt({
    baseline: false,
    isHistorySettled: true,
    isWatched: true,
    skippedCount: 3,
    ...props,
  });

describe('util: toWatchedGapPrompt', () => {
  it('should prompt when a watched episode leaves a gap behind it', () => {
    expect(prompt()).toEqual({ baseline: true, shouldPrompt: true });
  });

  it('should not prompt when nothing was skipped', () => {
    expect(prompt({ skippedCount: 0 })).toEqual({
      baseline: true,
      shouldPrompt: false,
    });
  });

  it('should not prompt on the first observed state', () => {
    expect(prompt({ baseline: null })).toEqual({
      baseline: true,
      shouldPrompt: false,
    });
  });

  it('should not prompt on a re-watch of an already watched episode', () => {
    expect(prompt({ baseline: true })).toEqual({
      baseline: true,
      shouldPrompt: false,
    });
  });

  it('should not prompt when the episode became unwatched', () => {
    expect(prompt({ baseline: true, isWatched: false })).toEqual({
      baseline: false,
      shouldPrompt: false,
    });
  });

  describe('while the history is unsettled', () => {
    it('should not read an unsettled history as unwatched', () => {
      expect(
        prompt({
          baseline: null,
          isHistorySettled: false,
          isWatched: false,
        }),
      ).toEqual({ baseline: null, shouldPrompt: false });
    });

    it('should not prompt when a settling history reveals a watched episode', () => {
      const loading = prompt({
        baseline: null,
        isHistorySettled: false,
        isWatched: false,
      });

      expect(prompt({ baseline: loading.baseline })).toEqual({
        baseline: true,
        shouldPrompt: false,
      });
    });

    it('should keep the settled baseline across a refetch', () => {
      const refetching = prompt({
        isHistorySettled: false,
        isWatched: false,
      });

      expect(refetching.baseline).toBe(false);
      expect(prompt({ baseline: refetching.baseline })).toEqual({
        baseline: true,
        shouldPrompt: true,
      });
    });
  });
});
