import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

const CHARACTER_COUNT_THRESHOLD = 35;
const SHORT_ASPECTS_LIMIT = 3;
const LONG_ASPECTS_LIMIT = 2;

export function calculateAspectsLimit(sentiment: SentimentAnalysis): number {
  const allAspects = [...sentiment.aspect.pros, ...sentiment.aspect.cons];
  if (allAspects.length === 0) return SHORT_ASPECTS_LIMIT;

  const averageLength =
    allAspects.reduce((sum, aspect) => sum + aspect.length, 0) /
    allAspects.length;

  return averageLength <= CHARACTER_COUNT_THRESHOLD
    ? SHORT_ASPECTS_LIMIT
    : LONG_ASPECTS_LIMIT;
}
