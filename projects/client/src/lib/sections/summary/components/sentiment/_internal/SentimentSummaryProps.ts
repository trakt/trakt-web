import type { RealityCheckVariant } from '$lib/requests/models/RealityCheckVariant.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

export type SentimentSummaryProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheckVariant | null | undefined;
  hasRing?: boolean;
};
