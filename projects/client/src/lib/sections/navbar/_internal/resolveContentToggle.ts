import type { ContentToggleSurface } from './ContentToggleSurface.ts';

type ContentToggleConfig = {
  surface: ContentToggleSurface;
  audience: 'all' | 'authenticated';
};

const SEARCH_ROUTE_IDS: ReadonlySet<string> = new Set(['/search']);

const DISCOVER_ROUTE_IDS: ReadonlySet<string> = new Set([
  '/',
  '/discover',
  '/calendar',
  '/history',
  '/social/activity',
  '/lists/official/[list]',
  '/movies/[slug]/lists',
  '/profile/me',
  '/profile/[slug]',
  '/profile/[slug]/favorites',
  '/profile/[slug]/history',
  '/profile/[slug]/progress',
  '/users/[user]/library',
  '/users/[user]/lists',
  '/users/[user]/lists/[list]',
  '/users/[user]/lists/view/collaborations',
  '/users/[user]/lists/view/liked',
  '/users/[user]/lists/view/personal',
  '/users/[user]/progress',
  '/users/[user]/start-watching',
  '/users/[user]/watchlist',
]);

const AUTHENTICATED_ONLY_ROUTE_IDS: ReadonlySet<string> = new Set([
  '/profile/[slug]',
]);

const SMALL_SCREEN_ROUTE_IDS: ReadonlySet<string> = new Set([
  '/',
  '/discover',
  '/profile/me',
  '/profile/[slug]',
  '/users/[user]/lists',
]);

export function resolveContentToggle(
  routeId: string | Nil,
  screen: 'large' | 'small' = 'large',
): ContentToggleConfig | null {
  if (!routeId) return null;
  if (screen === 'small' && !SMALL_SCREEN_ROUTE_IDS.has(routeId)) return null;

  const surface = resolveSurface(routeId);
  if (!surface) return null;

  return {
    surface,
    audience: AUTHENTICATED_ONLY_ROUTE_IDS.has(routeId)
      ? 'authenticated'
      : 'all',
  };
}

function resolveSurface(routeId: string): ContentToggleSurface | null {
  if (SEARCH_ROUTE_IDS.has(routeId)) return 'search';
  if (DISCOVER_ROUTE_IDS.has(routeId)) return 'discover';
  return null;
}
