import { mapToMediaRating } from '$lib/requests/_internal/mapToMediaRating.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { CrewResponse, PeopleResponse } from '@trakt/api';

type FetchMediaDataParams = {
  type: MediaType;
  slug: string;
  requestKey?: string;
  logDebug?: (message: string) => void;
} & ApiParams;

const measureQuery = async <T>(
  {
    label,
    query,
    requestKey,
    logDebug,
  }: {
    label: string;
    query: () => Promise<T>;
    requestKey?: string;
    logDebug?: (message: string) => void;
  },
): Promise<T> => {
  const startedAt = Date.now();
  const result = await query();
  const requestLabel = requestKey ? ` ${requestKey}` : '';

  logDebug?.(
    `[shareable-image] media query ${label} ${
      Date.now() - startedAt
    }ms${requestLabel}`,
  );

  return result;
};

const toCrewMember = (
  person: CrewResponse,
): MediaCrew['directors'][number] => ({
  name: person.person.name,
  key: person.person.ids.slug,
  ...(person.episode_count != null
    ? { episodeCount: person.episode_count }
    : {}),
  jobs: person.jobs,
});

const mapToShareMediaCrew = (people: PeopleResponse): MediaCrew => ({
  directors: (people.crew?.directing ?? []).map(toCrewMember),
  writers: (people.crew?.writing ?? []).map(toCrewMember),
  creators: (people.crew?.['created by'] ?? []).map(toCrewMember),
  // Share image only needs primary crew names; cast is intentionally skipped.
  cast: [],
});

function resolveMediaData(
  { type, slug, fetch, requestKey, logDebug }: FetchMediaDataParams,
) {
  if (type === 'movie') {
    return Promise.all(
      [
        measureQuery({
          label: 'movieSummary',
          requestKey,
          logDebug,
          query: async () => {
            const response = await api({ fetch }).movies.summary({
              params: { id: slug },
              query: { extended: 'images,colors' },
            });

            return mapToMovieEntry(response.body);
          },
        }),
        measureQuery({
          label: 'movieRating',
          requestKey,
          logDebug,
          query: async () => {
            const response = await api({ fetch }).movies.ratings({
              params: { id: slug },
              query: { extended: 'all' },
            });

            return mapToMediaRating(response.body);
          },
        }),
        measureQuery({
          label: 'moviePeople',
          requestKey,
          logDebug,
          query: async () => {
            const response = await api({ fetch }).movies.people({
              params: { id: slug },
            });

            return mapToShareMediaCrew(response.body);
          },
        }),
      ] as const,
    );
  }

  return Promise.all(
    [
      measureQuery({
        label: 'showSummary',
        requestKey,
        logDebug,
        query: async () => {
          const response = await api({ fetch }).shows.summary({
            params: { id: slug },
            query: { extended: 'images,colors' },
          });

          return mapToShowEntry(response.body);
        },
      }),
      measureQuery({
        label: 'showRating',
        requestKey,
        logDebug,
        query: async () => {
          const response = await api({ fetch }).shows.ratings({
            params: { id: slug },
            query: { extended: 'all' },
          });

          return mapToMediaRating(response.body);
        },
      }),
      measureQuery({
        label: 'showPeople',
        requestKey,
        logDebug,
        query: async () => {
          const response = await api({ fetch }).shows.people({
            params: { id: slug },
          });

          return mapToShareMediaCrew(response.body);
        },
      }),
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
