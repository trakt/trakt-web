import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { SummarySentiment } from './toSummarySentiment.ts';

/**
 * One compact line referencing every header section that has something to say.
 *
 * Each field is nullable/emptiable and its segment simply does not render -
 * the strip is a summary of what exists, never a list of placeholders. Counts
 * are totals (how much a drilldown holds), not the header's display limits.
 */
export type GlanceStripProps = {
  /** Each segment roots straight to its section's own drawer. */
  links: {
    details: string;
    whereToWatch: string;
    social: string;
    sentiment: string;
    awards: string;
    reactions: string;
    trivia: string;
  };
  /** For the per-segment aria labels. */
  title: string;
  /** e.g. "2025 · 9 episodes" - year plus length, pre-joined. */
  release: string | null;
  /** The lead provider - the same first pick the watch list leads with. */
  provider: StreamingServiceOption | null;
  country: string;
  social: {
    users: ReadonlyArray<UserProfile>;
    count: number;
  } | null;
  sentiment: SummarySentiment | null;
  awardsCount: number;
  reactions: {
    top: ReadonlyArray<ReactionSentiment>;
    total: number;
  } | null;
  triviaCount: number;
};
