import type { ContentToggleSurface } from './ContentToggleSurface.ts';

type ContentToggleConfig = {
  surface: ContentToggleSurface;
  audience: 'all' | 'authenticated';
};

// The single source of truth for where the content-type toggle appears. Keyed on
// SvelteKit's route.id (the route PATTERN, not the resolved pathname), so it is
// param-proof and flips atomically during navigation. Adding/removing a surface
// is a one-line edit here - no scattered per-page renders.

// Search surface: the full 5-option toggle, expanded (Media/Shows/Movies + People/Lists).
const SEARCH_ROUTE_IDS: ReadonlySet<string> = new Set(['/search']);

// Discover surface (Media/Shows/Movies): mirrors today's exact coverage - the 5
// pages that inline DiscoverToggles plus the 16 that receive it via
// ResponsiveNavbarStateSetter.
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

// Public pages whose legacy per-page toggle was rendered behind
// RenderFor audience="authenticated" - keep it member-only there for parity.
const AUTHENTICATED_ONLY_ROUTE_IDS: ReadonlySet<string> = new Set([
  '/profile/[slug]',
]);

export function resolveContentToggle(
  routeId: string | Nil,
): ContentToggleConfig | null {
  if (!routeId) return null;

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
