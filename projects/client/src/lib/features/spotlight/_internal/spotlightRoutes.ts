import * as m from '$lib/features/i18n/messages';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { SpotlightRoute } from './models/SpotlightRoute.ts';

/**
 * Static catalog of navigable destinations the spotlight can jump to.
 *
 * POC scope: top-level, non-parameterized routes only. Keywords are English
 * aliases layered on top of the translated label to widen fuzzy matching.
 */
export const spotlightRoutes: ReadonlyArray<SpotlightRoute> = [
  {
    id: 'home',
    url: UrlBuilder.home(),
    label: m.page_title_home,
    keywords: ['home', 'dashboard', 'up next'],
  },
  {
    id: 'shows',
    url: UrlBuilder.shows(),
    label: m.page_title_shows,
    keywords: ['shows', 'tv', 'series'],
  },
  {
    id: 'movies',
    url: UrlBuilder.movies(),
    label: m.page_title_movies,
    keywords: ['movies', 'films', 'cinema'],
  },
  {
    id: 'discover',
    url: UrlBuilder.discover(),
    label: m.page_title_discover,
    keywords: ['discover', 'browse', 'explore'],
  },
  {
    id: 'calendar',
    url: UrlBuilder.calendar(),
    label: m.page_title_calendar,
    keywords: ['calendar', 'schedule', 'upcoming', 'airing'],
  },
  {
    id: 'search',
    url: UrlBuilder.search(),
    label: m.page_title_search,
    keywords: ['search', 'find', 'lookup'],
  },
  {
    id: 'trending',
    url: UrlBuilder.trending(),
    label: m.page_title_trending_media,
    keywords: ['trending', 'hot', 'now'],
  },
  {
    id: 'popular',
    url: UrlBuilder.popular(),
    label: m.page_title_popular_media,
    keywords: ['popular', 'top'],
  },
  {
    id: 'anticipated',
    url: UrlBuilder.anticipated(),
    label: m.page_title_anticipated_media,
    keywords: ['anticipated', 'awaited', 'soon'],
  },
  {
    id: 'recommended',
    url: UrlBuilder.recommended(),
    label: m.page_title_recommended_media,
    keywords: ['recommended', 'for you', 'suggestions'],
  },
  {
    id: 'history',
    url: UrlBuilder.history.home(),
    label: m.page_title_history,
    keywords: ['history', 'watched', 'recently watched'],
  },
  {
    id: 'lists',
    url: UrlBuilder.lists.smart.all(),
    label: m.page_title_lists,
    keywords: ['lists', 'collections', 'smart lists'],
  },
  {
    id: 'profile',
    url: UrlBuilder.profile.me(),
    label: m.page_title_profile,
    keywords: ['profile', 'me', 'account'],
  },
  {
    id: 'settings',
    url: UrlBuilder.settings.general(),
    label: m.page_title_settings,
    keywords: ['settings', 'preferences', 'config'],
  },
  {
    id: 'about',
    url: UrlBuilder.about(),
    label: m.page_title_about,
    keywords: ['about', 'info'],
  },
];
