import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';
import { describe, expect, it } from 'vitest';
import { calculateAspectsLimit } from './calculateAspectsLimit.ts';

describe('calculateAspectsLimit', () => {
  const mockSentiment = (
    pros: string[],
    cons: string[],
  ): SentimentAnalysis => ({
    analysis: '',
    highlight: '',
    aspect: { pros, cons },
  });

  it('returns 3 when average aspect length is below the threshold', () => {
    const sentiment = mockSentiment(['Great acting', 'Good pacing'], [
      'Slow start',
    ]);
    expect(calculateAspectsLimit(sentiment)).toBe(3);
  });

  it('returns 3 when average aspect length equals the threshold', () => {
    const thirtyFiveChars = 'a'.repeat(35);
    const sentiment = mockSentiment([thirtyFiveChars], []);
    expect(calculateAspectsLimit(sentiment)).toBe(3);
  });

  it('returns 2 when average aspect length exceeds the threshold', () => {
    const longAspect = 'a'.repeat(36);
    const sentiment = mockSentiment([longAspect], []);
    expect(calculateAspectsLimit(sentiment)).toBe(2);
  });

  it('returns 2 when average of mixed pros and cons exceeds the threshold', () => {
    const sentiment = mockSentiment(
      ['Exceptionally well-crafted cinematography'],
      ['The narrative pacing felt inconsistent throughout'],
    );
    expect(calculateAspectsLimit(sentiment)).toBe(2);
  });

  it('returns 3 when only pros are provided and they are short', () => {
    const sentiment = mockSentiment(['Fun', 'Fast', 'Great'], []);
    expect(calculateAspectsLimit(sentiment)).toBe(3);
  });

  it('returns 3 when only cons are provided and they are short', () => {
    const sentiment = mockSentiment([], ['Boring', 'Too long']);
    expect(calculateAspectsLimit(sentiment)).toBe(3);
  });
});
