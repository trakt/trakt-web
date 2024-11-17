import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

export type RecommendedShow = {
  id: number;
  runtime: number;
  title: string;
  poster: {
    url: string;
  };
};

export function recommendShows(): Promise<RecommendedShow[]> {
  return api.recommendations.shows.recommend({
    query: {
      extended: 'full,cloud9',
      ignore_collected: true,
      ignore_watchlisted: true,
      limit: 35,
    },
    extraHeaders: {
      ...authHeader(),
    },
  })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error(
          'The recommended shows, like elusive phantoms, refuse to materialize.',
        );
      }

      return body.map((show) => {
        return {
          id: show.ids.trakt,
          title: show.title,
          runtime: show.runtime!,
          poster: {
            url: prependHttps(
              show.images?.poster.at(1) ??
                show.images?.poster.at(0),
            )!,
          },
        };
      });
    });
}
