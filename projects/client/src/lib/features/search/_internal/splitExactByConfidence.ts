import type { MediaSearchResult } from '$lib/requests/queries/search/searchMediaQuery.ts';

type ExactItems = MediaSearchResult['items'];

/** Mirrors the score bands the API assigns to an exact hit. */
const CONFIDENT_SCORE = 0.5;

const isConfident = (item: ExactItems[number]) => item.score >= CONFIDENT_SCORE;

/**
 * Split exact hits into the ones that may outrank fuzzy results and the deep
 * catalog tail that must not. Scores are only comparable within a source, so
 * bucket on the threshold rather than sorting across sources by raw score.
 */
export function splitExactByConfidence(
  items: ExactItems,
): { confident: ExactItems; deep: ExactItems } {
  return {
    confident: items.filter(isConfident),
    deep: items.filter((item) => !isConfident(item)),
  };
}
