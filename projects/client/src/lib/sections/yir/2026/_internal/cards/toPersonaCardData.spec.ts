import { dummyYirPersonaResult } from '$lib/requests/_internal/dummyYirPersonaResult.ts';
import { describe, expect, it } from 'vitest';
import { toPersonaCardData } from './toPersonaCardData.ts';

describe('util: toPersonaCardData', () => {
  const result = dummyYirPersonaResult({ persona: 'critic' });

  it('should pad the card number to two digits', () => {
    expect(
      toPersonaCardData({
        result,
        persona: 'critic',
        highlights: result.highlights,
      }).number,
    ).toBe('08');
  });

  it('should use the copy of the requested persona', () => {
    const card = toPersonaCardData({
      result,
      persona: 'cinephile',
      highlights: result.runnerUpHighlights,
    });

    expect(card.persona).toBe('cinephile');
    expect(card.name).toBe('The Cinephile');
  });

  it('should expose the average rating for the stars', () => {
    const card = toPersonaCardData({
      result,
      persona: 'critic',
      highlights: result.highlights,
    });

    expect(card.rating).toBe(7.2);
    expect(card.share).toBeNull();
    expect(card.stats).toHaveLength(3);
  });
});
