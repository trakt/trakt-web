import type { SpotlightRoute } from './models/SpotlightRoute.ts';

const NO_MATCH = Number.POSITIVE_INFINITY;

function scoreRoute(route: SpotlightRoute, query: string): number {
  const label = route.label().toLowerCase();

  if (label.startsWith(query)) return 0;
  if (label.includes(query)) return 1;

  const keywordScores = route.keywords.map((keyword) => {
    const normalized = keyword.toLowerCase();
    if (normalized.startsWith(query)) return 2;
    if (normalized.includes(query)) return 3;
    return NO_MATCH;
  });

  return Math.min(NO_MATCH, ...keywordScores);
}

/**
 * Ranks routes against a free-text query. Pure: given the same routes and
 * query it always returns the same ordering. An empty query yields no results
 * so the UI can stay collapsed until the user types.
 */
export function filterSpotlightRoutes(
  routes: ReadonlyArray<SpotlightRoute>,
  query: string,
): ReadonlyArray<SpotlightRoute> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return routes
    .map((route) => ({ route, score: scoreRoute(route, normalized) }))
    .filter(({ score }) => score !== NO_MATCH)
    .sort((a, b) =>
      a.score - b.score || a.route.label().localeCompare(b.route.label())
    )
    .map(({ route }) => route);
}
