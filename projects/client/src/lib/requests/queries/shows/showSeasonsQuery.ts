import type { SeasonsResponse } from '$lib/api.ts';
import type { Season } from '$lib/models/Season.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowSeasonsQuery = { slug: string } & ApiParams;

function mapSeasonResponseToSeason(item: SeasonsResponse[0]): Season {
  return {
    id: item.ids.trakt,
    number: item.number,
    episodes: {
      count: item.episode_count ?? 0,
    },
  };
}

function showSeasonsRequest(
  { fetch, slug }: ShowSeasonsQuery,
): Promise<Season[]> {
  return api({ fetch })
    .shows
    .seasons({
      params: {
        id: slug,
      },
      query: {
        extended: 'full',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up seasons');
      }

      return body.map(mapSeasonResponseToSeason);
    });
}

export const showSeasonsQueryKey = (id: string) => ['showSeasons', id] as const;
export const showSeasonsQuery = (
  params: ShowSeasonsQuery,
) => ({
  queryKey: showSeasonsQueryKey(params.slug),
  queryFn: () => showSeasonsRequest(params),
});
