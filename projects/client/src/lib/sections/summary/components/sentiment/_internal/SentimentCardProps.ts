import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis';

export type SentimentCardProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheck | null | undefined;
  type: MediaType;
  id: number;
};
