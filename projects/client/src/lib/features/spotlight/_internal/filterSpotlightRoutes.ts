import type { SpotlightKeyword } from './models/SpotlightKeyword.ts';
import type { SpotlightRoute } from './models/SpotlightRoute.ts';

const NO_MATCH = Number.POSITIVE_INFINITY;

function toKeywordText(keyword: SpotlightKeyword): string {
  return typeof keyword === 'function' ? keyword() : keyword;
}

type ScoreRouteProps = {
  label: string;
  keywords: ReadonlyArray<string>;
  query: string;
};

function scoreRoute({ label, keywords, query }: ScoreRouteProps): number {
  if (label.startsWith(query)) return 0;
  if (label.includes(query)) return 1;

  const keywordScores = keywords.map((keyword) => {
    const normalized = keyword.toLowerCase();
    if (normalized.startsWith(query)) return 2;
    if (normalized.includes(query)) return 3;
    return NO_MATCH;
  });

  return Math.min(NO_MATCH, ...keywordScores);
}

export function filterSpotlightRoutes(
  routes: ReadonlyArray<SpotlightRoute>,
  query: string,
): ReadonlyArray<SpotlightRoute> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return routes
    .map((route) => {
      const label = route.label().toLowerCase();
      return {
        route,
        label,
        score: scoreRoute({
          label,
          keywords: route.keywords.map(toKeywordText),
          query: normalized,
        }),
      };
    })
    .filter(({ score }) => score !== NO_MATCH)
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .map(({ route }) => route);
}
