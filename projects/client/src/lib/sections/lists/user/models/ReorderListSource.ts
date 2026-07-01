import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

export type ReorderListSource =
  | {
    type: 'user-list';
    list: MediaListSummary;
  }
  | {
    type: 'watchlist';
  };
