import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { buildParamString } from './buildParamString.ts';

type PaginatableMediaPageUrl = {
  type: MediaType | 'episode';
  page?: number;
};

const mediaDrilldownFactory =
  (category: string) => ({ type, page }: PaginatableMediaPageUrl) => {
    const baseUrl = `/${type}s/${category}`;
    return baseUrl + buildParamString({ page });
  };

const categoryDrilldownFactory =
  (category: string) => ({ type, page }: PaginatableMediaPageUrl) => {
    const baseUrl = `/${category}/${type}s`;
    return baseUrl + buildParamString({ page });
  };

export const UrlBuilder = {
  history: (params: PaginatableMediaPageUrl) => {
    return categoryDrilldownFactory('history')(params);
  },
  watched: (params: PaginatableMediaPageUrl) => {
    return categoryDrilldownFactory('watched')(params);
  },
  watchlistPage(params: PaginatableMediaPageUrl) {
    return categoryDrilldownFactory('watchlist')(params);
  },
  trending(params: PaginatableMediaPageUrl) {
    return mediaDrilldownFactory('trending')(params);
  },
  recommended(params: PaginatableMediaPageUrl) {
    return mediaDrilldownFactory('recommended')(params);
  },
  anticipated(params: PaginatableMediaPageUrl) {
    return mediaDrilldownFactory('anticipated')(params);
  },
  popular(params: PaginatableMediaPageUrl) {
    return mediaDrilldownFactory('popular')(params);
  },
  social: {
    activity: (_: PaginatableMediaPageUrl) => {
      return '/social/activity';
    },
  },
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
  movies: () => '/movies',
  movie: (id: string) => `/movies/${id}`,
  people: (id: string) => `/people/${id}`,
  episode: (id: string, season: number, episode: number) =>
    `/shows/${id}/seasons/${season}/episodes/${episode}`,
  profile: {
    user: (username: string) => `/profile/${username}`,
    me: () => UrlBuilder.profile.user('me'),
  },
  users: (id: string) => ({
    lists: (slug: string, type?: MediaType) =>
      type
        ? `/users/${id}/lists/${slug}?type=${type}`
        : `/users/${id}/lists/${slug}`,
  }),
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
    user: (slug: string) => `https://trakt.tv/users/${slug}`,
  },
};
