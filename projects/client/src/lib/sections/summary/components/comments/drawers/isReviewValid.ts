const wordCountThreshold = 5;

// Languages that don't separate words with whitespace — each character is
// roughly one morpheme, so we count them individually in the fallback path.
const CjkPattern =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const wordPattern = /[\p{L}\p{N}]+/gu;

const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'word' })
  : null;

function countWithSegmenter(
  review: string,
  segmenter: Intl.Segmenter,
): number {
  return [...segmenter.segment(review)]
    .filter((segment) => segment.isWordLike)
    .length;
}

function countWithoutSegmenter(review: string): number {
  const cjkCharacters = review.match(CjkPattern)?.length ?? 0;
  const remaining = review.replace(CjkPattern, ' ');
  const words = remaining.match(wordPattern)?.length ?? 0;
  return cjkCharacters + words;
}

export function isReviewValid(review: string): boolean {
  const count = segmenter
    ? countWithSegmenter(review, segmenter)
    : countWithoutSegmenter(review);

  return count >= wordCountThreshold;
}
