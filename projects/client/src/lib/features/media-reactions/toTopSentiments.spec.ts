import { describe, expect, it } from 'vitest';
import type { ReactionMetric } from '$lib/requests/models/ReactionMetric.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { toTopSentiments } from './toTopSentiments.ts';

function metric(
  sentiment: ReactionSentiment,
  count: number,
): ReactionMetric {
  return { sentiment, count, hasReacted: false };
}

describe('util: toTopSentiments', () => {
  it('should lead with the most used', () => {
    const top = toTopSentiments([
      metric('bored', 3),
      metric('love', 9),
      metric('shook', 5),
    ]);

    expect(top).toEqual(['love', 'shook', 'bored']);
  });

  it('should show at most three', () => {
    const top = toTopSentiments([
      metric('love', 9),
      metric('shook', 5),
      metric('bored', 3),
      metric('vomit', 1),
    ]);

    expect(top).toEqual(['love', 'shook', 'bored']);
  });

  it('should drop sentiments nobody picked', () => {
    const top = toTopSentiments([
      metric('love', 4),
      metric('bored', 0),
      metric('vomit', 0),
    ]);

    expect(top).toEqual(['love']);
  });

  it('should report nothing for a title nobody has reacted to', () => {
    expect(toTopSentiments([metric('love', 0)])).toEqual([]);
  });

  it('should leave the caller its own array', () => {
    const metrics = [metric('bored', 1), metric('love', 2)];

    toTopSentiments(metrics);

    expect(metrics[0]?.sentiment).toBe('bored');
  });
});
