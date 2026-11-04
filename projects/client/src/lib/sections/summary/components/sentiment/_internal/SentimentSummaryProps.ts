import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

export type SentimentSummaryProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheck | null | undefined;
  hasRing?: boolean;
};
