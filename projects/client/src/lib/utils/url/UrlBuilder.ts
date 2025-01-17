import type { MediaType } from '$lib/models/MediaType.ts';
import { buildParamString } from './buildParamString';

type PaginatableMediaPageUrl = {
  type: MediaType;
  page?: number;
};

export const UrlBuilder = {
  home: () => '/',
  shows: () => '/shows',
  media: (type: MediaType, id: string) => {
    switch (type) {
      case 'show':
        return UrlBuilder.show(id);
      case 'movie':
        return UrlBuilder.movie(id);
    }
  },
  show: (id: string) => `/shows/${id}`,
  trending: ({ type, page }: PaginatableMediaPageUrl) => {
    const trendingMediaUrl = (() => {
      switch (type) {
        case 'show':
          return '/shows/trending';
        case 'movie':
          return '/movies/trending';
      }
    })();

    return trendingMediaUrl + buildParamString({ page });
  },
  recommended: ({ type, page }: PaginatableMediaPageUrl) => {
    const trendingMediaUrl = (() => {
      switch (type) {
        case 'show':
          return '/shows/recommended';
        case 'movie':
          return '/movies/recommended';
      }
    })();

    return trendingMediaUrl + buildParamString({ page });
  },
  movies: () => '/movies',
  movie: (id: string) => `/movies/${id}`,
  people: (id: string) => `/people/${id}`,
  episode: (id: string, season: number, episode: number) =>
    `/shows/${id}/seasons/${season}/episodes/${episode}`,
  profile: {
    user: (username: string) => `/profile/${username}`,
    me: () => UrlBuilder.profile.user('me'),
  },
  app: {
    android: () => 'https://trakt.tv/a/trakt-android',
    ios: () => 'https://trakt.tv/a/trakt-ios',
  },
  github: () => 'https://github.com/trakt/trakt-lite',
  vip: () => 'https://trakt.tv/vip',
  watchlist: () => '/watchlist',
  og: {
    yearToDate: (slug: string, year: number) =>
      `https://trakt.tv/users/${slug}/year/${year}`,
    getVip: () => 'https://trakt.tv/vip',
  },
};
