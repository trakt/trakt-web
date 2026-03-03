import type { EpisodeActivityHistory } from '$lib/requests/queries/users/episodeActivityHistoryQuery.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';

export type HistoryEntry =
  | MovieActivityHistory
  | ShowActivityHistory
  | EpisodeActivityHistory;
