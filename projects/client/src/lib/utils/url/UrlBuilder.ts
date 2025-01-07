import type { MediaType } from '$lib/models/MediaType.ts';

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
  movies: () => '/movies',
  movie: (id: string) => `/movies/${id}`,
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
