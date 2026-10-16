import type { PickerItems } from './PickerItems.ts';

type Media = { id: number; title: string };
type Fit = { id: number; score: number };

type PickerParams<T extends Media> = {
  history: ReadonlyArray<T>;
  picks: ReadonlyArray<number>;
  fits: ReadonlyArray<Fit>;
  query: string;
};

export function toPickerItems<T extends Media>(
  { history, picks, fits, query }: PickerParams<T>,
): PickerItems<T> {
  const unpicked = history.filter(({ id }) => !picks.includes(id));
  const fitIds = new Set(fits.map(({ id }) => id));
  const needle = query.trim().toLowerCase();

  if (needle) {
    const items = unpicked
      .filter(({ title }) => title.toLowerCase().includes(needle))
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

  const byId = new Map(unpicked.map((media) => [media.id, media]));
  const items = fits.flatMap(({ id }) => {
    const media = byId.get(id);
    return media ? [{ media, isOff: false }] : [];
  });
  return { kind: 'fits', items };
}
