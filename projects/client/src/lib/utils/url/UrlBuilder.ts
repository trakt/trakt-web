import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { buildParamString } from './buildParamString.ts';

type TypeParams = {
  type: MediaType | 'episode';
};

type WellKnownQueryParams = {
  page?: number;
  watch_window?: number;
  min_year?: number;
};

type UrlBuilderParams = TypeParams & WellKnownQueryParams;

function sanitizeParams(
  params: WellKnownQueryParams,
): WellKnownQueryParams {
  return {
    page: params.page,
    watch_window: params.watch_window,
    min_year: params.min_year,
  };
}

const mediaDrilldownFactory =
  (category: string) => ({ type, ...params }: UrlBuilderParams) => {
    const baseUrl = `/${type}s/${category}`;
    return baseUrl + buildParamString(sanitizeParams(params));
  };

const categoryDrilldownFactory =
  (category: string) => ({ type, page }: UrlBuilderParams) => {
    const baseUrl = `/${category}/${type}s`;
    return baseUrl + buildParamString({ page });
  };

export const UrlBuilder = {
  history: {
    category: (params: UrlBuilderParams) => {
      return categoryDrilldownFactory('history')(params);
    },
    all: ({ page }: UrlBuilderParams) => {
      return `/history${buildParamString({ page })}`;
    },
  },
  watched: (params: UrlBuilderParams) => {
    return categoryDrilldownFactory('watched')(params);
  },
  watchlistPage(params: UrlBuilderParams) {
    return categoryDrilldownFactory('watchlist')(params);
  },
  trending(params: UrlBuilderParams) {
    return mediaDrilldownFactory('trending')(params);
  },
  streaming(params: UrlBuilderParams) {
    return mediaDrilldownFactory('streaming')(params);
  },
  recommended(params: UrlBuilderParams) {
    return mediaDrilldownFactory('recommended')(params);
  },
  anticipated(params: UrlBuilderParams) {
    return mediaDrilldownFactory('anticipated')(params);
  },
  popular(params: UrlBuilderParams) {
    return mediaDrilldownFactory('popular')(params);
  },
  social: {
    activity: (_: UrlBuilderParams) => {
      return '/social/activity';
    },
  },
  progress: (user: string) => `/users/${user}/progress`,
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
  lists: {
    official: (id: number, type?: MediaType) =>
      `/lists/official/${id}?type=${type}`,
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
    site: () => 'https://trakt.tv',
    status: () => 'https://status.trakt.tv',
  },
};
