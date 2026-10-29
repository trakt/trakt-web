import { dedupe } from '$lib/utils/array/dedupe.ts';
import type { PickerItem, PickerItems } from './PickerItems.ts';

type Media = { id: number; title: string };
type Fit = { id: number; score: number };

type PickerParams<T extends Media> = {
  history: ReadonlyArray<T>;
  searchResults: ReadonlyArray<T>;
  fitMedia: ReadonlyArray<T>;
  picked: ReadonlyArray<T>;
  picks: ReadonlyArray<number>;
  fits: ReadonlyArray<Fit>;
  query: string;
};

const matches = (needle: string) => (media: Media) =>
  media.title.toLowerCase().includes(needle);

function toPickedItems<T extends Media>(
  picks: ReadonlyArray<number>,
  picked: ReadonlyArray<T>,
): Array<PickerItem<T>> {
  return picks.flatMap((id, index) => {
    const media = picked.find((item) => item.id === id);
    return media ? [{ media, isOff: false, slot: index + 1 }] : [];
  });
}

export function toPickerItems<T extends Media>({
  history,
  searchResults,
  fitMedia,
  picked,
  picks,
  fits,
  query,
}: PickerParams<T>): PickerItems<T> {
  const unpicked = history.filter(({ id }) => !picks.includes(id));
  const fitIds = new Set(fits.map(({ id }) => id));
  const needle = query.trim().toLowerCase();
  const leading = toPickedItems(picks, picked);

  if (needle) {
    const matching = matches(needle);
    const recentMatches = unpicked.filter(matching);
    const olderMatches = searchResults.filter(
      (media) => !picks.includes(media.id) && matching(media),
    );
    const items = dedupe(({ id }) => id, [...recentMatches, ...olderMatches])
      .map((media) => ({
        media,
        isOff: picks.length > 0 && !fitIds.has(media.id),
        slot: null,
      }))
      .sort((a, b) => Number(a.isOff) - Number(b.isOff));
    return {
      kind: 'search',
      items: [...leading.filter(({ media }) => matching(media)), ...items],
    };
  }

  if (picks.length === 0) {
    return {
      kind: 'recent',
      items: unpicked.map((media) => ({ media, isOff: false, slot: null })),
    };
  }

  const byId = new Map(
    [...fitMedia, ...unpicked]
      .filter(({ id }) => !picks.includes(id))
      .map((media) => [media.id, media]),
  );
  const items = fits.flatMap(({ id }) => {
    const media = byId.get(id);
    return media ? [{ media, isOff: false, slot: null }] : [];
  });
  return { kind: 'fits', items: [...leading, ...items] };
}
