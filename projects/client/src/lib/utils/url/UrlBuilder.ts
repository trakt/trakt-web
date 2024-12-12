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
      default:
        throw new Error(`Invalid media type: ${type}`);
    }
  },
  show: (id: string) => `/show/${id}`,
  movies: () => '/movies',
  movie: (id: string) => `/movie/${id}`,
  profile: {
    user: (username: string) => `/profile/${username}`,
    me: () => UrlBuilder.profile.user('me'),
  },
  app: {
    android: () => 'https://trakt.tv/a/trakt-android',
    ios: () => 'https://trakt.tv/a/trakt-ios',
  },
  vip: () => 'https://trakt.tv/vip',
};
