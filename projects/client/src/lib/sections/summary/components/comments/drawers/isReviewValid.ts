const wordCountThreshold = 5;
const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });

export function isReviewValid(review: string): boolean {
  const words = [...segmenter.segment(review)]
    .filter((segment) => segment.isWordLike);

  return words.length >= wordCountThreshold;
}
