import type { SentimentVerdict } from './SentimentVerdict.ts';
import { toSentimentVerdict } from './_internal/toSentimentVerdict.ts';

type ToSentimentAspectsParams = {
  pros: ReadonlyArray<string>;
  cons: ReadonlyArray<string>;
  limit: number;
};

type SentimentAspects = {
  verdict: SentimentVerdict;
  pros: ReadonlyArray<string>;
  cons: ReadonlyArray<string>;
};

export function toSentimentAspects(
  { pros, cons, limit }: ToSentimentAspectsParams,
): SentimentAspects {
  const verdict = toSentimentVerdict({ pros, cons });

  if (verdict === 'positive') {
    return { verdict, pros: pros.slice(0, limit), cons: [] };
  }

  if (verdict === 'negative') {
    return { verdict, pros: [], cons: cons.slice(0, limit) };
  }

  const half = Math.floor(limit / 2);

  return { verdict, pros: pros.slice(0, half), cons: cons.slice(0, half) };
}
