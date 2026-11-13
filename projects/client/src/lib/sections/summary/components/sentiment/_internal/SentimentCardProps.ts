import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { RealityCheckVariant } from '$lib/requests/models/RealityCheckVariant.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis';

export type SentimentCardProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheckVariant | null | undefined;
  type: MediaType;
  id: number;
};
