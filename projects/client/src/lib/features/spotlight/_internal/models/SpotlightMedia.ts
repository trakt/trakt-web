import type { MediaResult } from '$lib/requests/queries/search/searchMediaQuery.ts';

export type SpotlightMedia = {
  movies: ReadonlyArray<MediaResult>;
  shows: ReadonlyArray<MediaResult>;
};
