import type { MediaType } from '$lib/models/MediaType.ts';

export type InvalidateActionOptions =
  | 'invalidate:mark_as_watched'
  | 'invalidate:auth'
  | `invalidate:watchlisted:${MediaType}`;

export const InvalidateAction = {
  MarkAsWatched: 'invalidate:mark_as_watched' as InvalidateActionOptions,
  Watchlisted: (type: MediaType): InvalidateActionOptions =>
    `invalidate:watchlisted:${type}`,
  Auth: 'invalidate:auth' as InvalidateActionOptions,
};
