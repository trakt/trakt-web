import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

type PeopleMovieCreditsParams = { slug: string } & ApiParams;

const peopleMovieCreditsRequest = (
  { fetch, slug }: PeopleMovieCreditsParams,
) =>
  api({ fetch })
    .people
    .movies({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch person movie credits');
      }

      return response.body.cast ?? [];
    });

export const peopleMovieCreditsQuery = defineQuery({
  key: 'peopleMovieCredits',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: peopleMovieCreditsRequest,
  mapper: (response) =>
    response.map(({ movie }) => mapMovieResponseToMovieSummary(movie)),
  schema: MediaEntrySchema.array(),
  ttl: time.days(7),
});
