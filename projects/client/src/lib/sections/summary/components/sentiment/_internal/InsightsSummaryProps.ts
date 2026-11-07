import type { MatchBasis } from '$lib/requests/models/MatchBasis.ts';
import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';
import type { SentimentAnalysis } from '$lib/requests/models/SentimentAnalysis.ts';

export type InsightsSummaryProps = {
  sentiment: SentimentAnalysis | Nil;
  realityCheck: RealityCheck | null | undefined;
  match?: number | null;
  kind?: MatchKind;
  basis?: MatchBasis;
  hasRing?: boolean;
  hasDrawer?: boolean;
};
