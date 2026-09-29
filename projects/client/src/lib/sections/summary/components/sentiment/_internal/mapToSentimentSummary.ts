import { toSentimentAspects } from '$lib/utils/sentiment/toSentimentAspects.ts';
import { toTranslatedSentimentVerdict } from '$lib/utils/formatting/string/toTranslatedSentimentVerdict.ts';
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
  const selected = toSentimentAspects({
    pros,
    cons,
    limit: calculateAspectsLimit(pros, cons),
  });

  return {
    text: toTranslatedSentimentVerdict(selected.verdict),
    aspects: [...selected.pros, ...selected.cons],
  };
}
