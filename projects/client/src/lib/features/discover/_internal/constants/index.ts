import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export const DISCOVER_ROUTES = [
  UrlBuilder.home(),
  UrlBuilder.calendar(),
  UrlBuilder.social.activity(),
  UrlBuilder.history.all({ type: 'movie' }),
  UrlBuilder.history.all({ type: 'show' }),
  UrlBuilder.progress('[user]'),
  UrlBuilder.discover(),
  UrlBuilder.startWatching('[user]'),
] as const;
