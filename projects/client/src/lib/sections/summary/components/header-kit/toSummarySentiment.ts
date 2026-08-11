import * as m from '$lib/features/i18n/messages.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

/**
 * Header-level view of the AI sentiment summary: one verdict plus at most three
 * short bullets. The cap is deliberate - the header is not the place for the
 * full breakdown, which sits behind the section chevron.
 *
 * Unlike the section-level `mapToSentimentSummary`, this keeps the verdict as a
 * token rather than a translated string, because the pill and the bullet dots
 * take their colour from it.
 */
export type SentimentVerdict = 'positive' | 'mixed' | 'negative';

export type SummarySentiment = {
  verdict: SentimentVerdict;
  label: string;
  bullets: ReadonlyArray<string>;
};

const BULLET_LIMIT = 3;

const VERDICT_LABEL: Record<SentimentVerdict, () => string> = {
  positive: () => m.header_sentiment_positive(),
  mixed: () => m.header_sentiment_mixed(),
  negative: () => m.header_sentiment_negative(),
};

function toVerdict(pros: number, cons: number): SentimentVerdict {
  if (pros > cons) {
    return 'positive';
  }

  if (cons > pros) {
    return 'negative';
  }

  return 'mixed';
}

export function toSummarySentiment(
  sentiment: SentimentAnalysis | Nil,
): SummarySentiment | null {
  const pros = sentiment?.aspect.pros ?? [];
  const cons = sentiment?.aspect.cons ?? [];

  if (pros.length === 0 && cons.length === 0) {
    return null;
  }

  const verdict = toVerdict(pros.length, cons.length);

  const bullets = verdict === 'negative'
    ? cons.slice(0, BULLET_LIMIT)
    : verdict === 'positive'
    ? pros.slice(0, BULLET_LIMIT)
    : [...pros, ...cons].slice(0, BULLET_LIMIT);

  return {
    verdict,
    label: VERDICT_LABEL[verdict](),
    bullets,
  };
}
