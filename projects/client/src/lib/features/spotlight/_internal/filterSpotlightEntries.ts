import type { SpotlightKeyword } from '../models/SpotlightKeyword.ts';

const NO_MATCH = Number.POSITIVE_INFINITY;

function toKeywordText(keyword: SpotlightKeyword): string {
  return typeof keyword === 'function' ? keyword() : keyword;
}

type ScoreEntryProps = {
  label: string;
  keywords: ReadonlyArray<string>;
  query: string;
};

function scoreEntry({ label, keywords, query }: ScoreEntryProps): number {
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

type SpotlightEntry = {
  label: () => string;
  keywords: ReadonlyArray<SpotlightKeyword>;
};

export function filterSpotlightEntries<TEntry extends SpotlightEntry>(
  entries: ReadonlyArray<TEntry>,
  query: string,
): ReadonlyArray<TEntry> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return entries
    .map((entry) => {
      const label = entry.label().toLowerCase();
      return {
        entry,
        label,
        score: scoreEntry({
          label,
          keywords: entry.keywords.map(toKeywordText),
          query: normalized,
        }),
      };
    })
    .filter(({ score }) => score !== NO_MATCH)
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .map(({ entry }) => entry);
}
