import { describe, expect, it } from 'vitest';
import { buildMatchStage } from './buildMatchStage.ts';
import type { MatchStripEntry } from './buildMatchStrip.ts';

const entries = (count: number): MatchStripEntry[] =>
  Array.from({ length: count }, (_, index) => ({
    key: `show-${index}`,
    id: index,
    type: 'show',
    isFavorite: false,
  }));

describe('buildMatchStage', () => {
  it('returns no cards when nothing was watched together', () => {
    expect(buildMatchStage([], 0)).toEqual({
      size: 'large',
      cards: [],
      more: 0,
    });
  });

  it('centres a single poster', () => {
    const stage = buildMatchStage(entries(1), 1);

    expect(stage.size).toBe('large');
    expect(stage.cards.map((card) => card.x)).toEqual([0]);
  });

  it('tilts a pair away from each other', () => {
    const stage = buildMatchStage(entries(2), 2);

    expect(stage.cards.map((card) => card.tilt)).toEqual([-7, 6]);
  });

  it('keeps three posters at full size', () => {
    expect(buildMatchStage(entries(3), 3).size).toBe('large');
  });

  it('fans five smaller posters and counts the rest', () => {
    const stage = buildMatchStage(entries(12), 26);

    expect(stage.size).toBe('small');
    expect(stage.cards).toHaveLength(5);
    expect(stage.more).toBe(21);
  });

  it('places the centre poster on top of the fan', () => {
    const stage = buildMatchStage(entries(5), 5);
    const top = Math.max(...stage.cards.map((card) => card.layer));

    expect(stage.cards[2]?.layer).toBe(top);
    expect(stage.more).toBe(0);
  });
});
