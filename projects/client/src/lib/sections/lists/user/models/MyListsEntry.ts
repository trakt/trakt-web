import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';

export type MyListsEntry =
  | { key: string; kind: 'smart'; list: SmartList }
  | { key: string; kind: 'custom'; list: MediaListSummary };
