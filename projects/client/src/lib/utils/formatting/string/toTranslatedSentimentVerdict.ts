import * as m from '$lib/features/i18n/messages.ts';
import type { SentimentVerdict } from '$lib/utils/sentiment/SentimentVerdict.ts';

const VERDICT_MAP: Record<SentimentVerdict, () => string> = {
  positive: m.header_sentiment_positive,
  negative: m.header_sentiment_negative,
  mixed: m.header_sentiment_mixed,
};

export function toTranslatedSentimentVerdict(
  verdict: SentimentVerdict,
): string {
  return VERDICT_MAP[verdict]();
}
