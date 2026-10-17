import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { PickerItems } from './PickerItems.ts';

type Media = { id: number; title: string };
type Fit = { id: number; score: number };

type PickerParams<T extends Media> = {
  history: ReadonlyArray<T>;
  searchResults: ReadonlyArray<T>;
  fitMedia: ReadonlyArray<T>;
  picks: ReadonlyArray<number>;
  fits: ReadonlyArray<Fit>;
  query: string;
};

export function toPickerItems<T extends Media>(
  { history, searchResults, fitMedia, picks, fits, query }: PickerParams<T>,
): PickerItems<T> {
  const unpicked = history.filter(({ id }) => !picks.includes(id));
  const fitIds = new Set(fits.map(({ id }) => id));
  const needle = query.trim().toLowerCase();

  if (needle) {
    const recentMatches = unpicked.filter(({ title }) =>
      title.toLowerCase().includes(needle)
    );
    const olderMatches = searchResults.filter(({ id, title }) =>
      !picks.includes(id) && title.toLowerCase().includes(needle)
    );
    const items = dedupe(({ id }) => id, [...recentMatches, ...olderMatches])
      .map((media) => ({
        media,
        isOff: picks.length > 0 && !fitIds.has(media.id),
      }))
      .sort((a, b) => Number(a.isOff) - Number(b.isOff));
    return { kind: 'search', items };
  }

  if (picks.length === 0) {
    return {
      kind: 'recent',
      items: unpicked.map((media) => ({ media, isOff: false })),
    };
  }

  const byId = new Map(
    [...fitMedia, ...unpicked]
      .filter(({ id }) => !picks.includes(id))
      .map((media) => [media.id, media]),
  );
  const items = fits.flatMap(({ id }) => {
    const media = byId.get(id);
    return media ? [{ media, isOff: false }] : [];
  });
  return { kind: 'fits', items };
}
