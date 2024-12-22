import type { MediaType } from '$lib/models/MediaType.ts';

export type InvalidateActionOptions =
  | `invalidate:mark_as_watched:${MediaType}`
  | 'invalidate:auth'
  | `invalidate:watchlisted:${MediaType}`;

export const InvalidateAction = {
  MarkAsWatched: (type: MediaType): InvalidateActionOptions =>
    `invalidate:mark_as_watched:${type}` as InvalidateActionOptions,
  Watchlisted: (type: MediaType): InvalidateActionOptions =>
    `invalidate:watchlisted:${type}`,
  Auth: 'invalidate:auth' as InvalidateActionOptions,
};
