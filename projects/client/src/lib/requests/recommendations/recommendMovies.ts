import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { api } from '../_internal/api.ts';
import { authHeader } from '../_internal/authHeader.ts';

export type RecommendedMovie = {
  id: number;
  runtime: number;
  title: string;
  poster: {
    url: string;
  };
};

export function recommendMovies(): Promise<RecommendedMovie[]> {
  return api.recommendations.movies.recommend({
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
          [
            'The digital projector sputters and dies.',
            'The recommended movies remain trapped in the celluloid void.',
          ].join(' '),
        );
      }

      return body.map((movie) => {
        return {
          id: movie.ids.trakt,
          title: movie.title,
          runtime: movie.runtime!,
          poster: {
            url: prependHttps(
              movie.images?.poster.at(1) ??
                movie.images?.poster.at(0),
            )!,
          },
        };
      });
    });
}
