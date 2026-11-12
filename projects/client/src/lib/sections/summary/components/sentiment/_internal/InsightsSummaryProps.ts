import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { RealityCheckVariant } from '$lib/requests/models/RealityCheckVariant.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

export type InsightsSummaryProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheckVariant | null | undefined;
  match?: number | null;
  kind?: MatchKind;
  hasRing?: boolean;
  hasDrawer?: boolean;
};
