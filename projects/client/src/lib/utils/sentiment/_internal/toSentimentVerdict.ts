import type { SentimentVerdict } from '$lib/utils/sentiment/SentimentVerdict.ts';

type ToSentimentVerdictParams = {
  pros: ReadonlyArray<string>;
  cons: ReadonlyArray<string>;
};

export function toSentimentVerdict(
  { pros, cons }: ToSentimentVerdictParams,
): SentimentVerdict {
  if (pros.length > cons.length) return 'positive';
  if (cons.length > pros.length) return 'negative';

  return 'mixed';
}
