const WORD_COUNT_THRESHOLD = 5;

export function isReviewValid(review: string): boolean {
  const words = review
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word));

  return words.length >= WORD_COUNT_THRESHOLD;
}
