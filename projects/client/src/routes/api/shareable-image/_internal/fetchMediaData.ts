import type { ApiParams } from '$lib/requests/api.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';

type FetchMediaDataParams = {
  type: MediaType;
  slug: string;
  onSummary?: (media: MediaEntry) => Promise<unknown>;
} & ApiParams;

function withSummaryHook<T extends MediaEntry>(
  summary: Promise<T | Nil>,
  onSummary: FetchMediaDataParams['onSummary'],
) {
  return summary.then(async (media) => {
    if (media && onSummary) {
      await onSummary(media).catch(() => undefined);
    }

    return media;
  });
}

function resolveMediaData(
  { type, slug, fetch, onSummary }: FetchMediaDataParams,
) {
  if (type === 'movie') {
    return Promise.all(
      [
        withSummaryHook(
          movieSummaryQuery({ slug, fetch }).execute(),
          onSummary,
        ),
        movieRatingQuery({ slug, fetch }).execute(),
        moviePeopleQuery({ slug, fetch }).execute(),
      ] as const,
    );
  }

  return Promise.all(
    [
      withSummaryHook(showSummaryQuery({ slug, fetch }).execute(), onSummary),
      showRatingQuery({ slug, fetch }).execute(),
      showPeopleQuery({ slug, fetch }).execute(),
    ] as const,
  );
}

export async function fetchMediaData(params: FetchMediaDataParams) {
  const [media, ratings, crew] = await resolveMediaData(params);

  if (!media || !ratings || !crew) {
    throw new Error('Incomplete media data');
  }

  return { media, ratings, crew };
}
