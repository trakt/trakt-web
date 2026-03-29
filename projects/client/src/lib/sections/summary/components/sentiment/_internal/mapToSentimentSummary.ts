import { m } from '$lib/features/i18n/messages.ts';
import { calculateAspectsLimit } from './calculateAspectsLimit.ts';

type MapToSentimentSummaryProps = {
  pros: string[];
  cons: string[];
};

type SentimentSummary = {
  text: string;
  aspects: string[];
};

export function mapToSentimentSummary(
  { pros, cons }: MapToSentimentSummaryProps,
): SentimentSummary {
  const summaryLimit = calculateAspectsLimit(pros, cons);

  const isPositive = pros.length > cons.length;
  const isNegative = cons.length > pros.length;

  if (isPositive) {
    return {
      text: m.header_sentiment_positive(),
      aspects: pros.slice(0, summaryLimit),
    };
  }

  if (isNegative) {
    return {
      text: m.header_sentiment_negative(),
      aspects: cons.slice(0, summaryLimit),
    };
  }

  const half = Math.floor(summaryLimit / 2);

  return {
    text: m.header_sentiment_mixed(),
    aspects: [...pros.slice(0, half), ...cons.slice(0, half)],
  };
}
