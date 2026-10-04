import type { ApiParams } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieTrendingRequest } from '$lib/requests/queries/movies/movieTrendingQuery.ts';
import { showTrendingRequest } from '$lib/requests/queries/shows/showTrendingQuery.ts';

const TRENDING_LIMIT = 10;

type FetchTrendingSlugsParams = { type: MediaType } & ApiParams;

async function fetchMovieSlugs({ fetch }: ApiParams) {
  const response = await movieTrendingRequest({ fetch, limit: TRENDING_LIMIT });
  if (response.status !== 200) return [];

  return response.body.map(({ movie }) => movie.ids.slug);
}

async function fetchShowSlugs({ fetch }: ApiParams) {
  const response = await showTrendingRequest({ fetch, limit: TRENDING_LIMIT });
  if (response.status !== 200) return [];

  return response.body.map(({ show }) => show.ids.slug);
}

export function fetchTrendingSlugs(
  { type, fetch }: FetchTrendingSlugsParams,
): Promise<ReadonlyArray<string>> {
  return type === 'movie'
    ? fetchMovieSlugs({ fetch })
    : fetchShowSlugs({ fetch });
}
