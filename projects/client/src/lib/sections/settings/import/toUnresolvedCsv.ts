import type { UniversalImportItem } from './ImportTypes.ts';

function toCsvField(value: string | number | undefined): string {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const HEADER =
  'title,year,action,watched_at,type,season,episode,imdb,tmdb,tvdb,trakt';

export function toUnresolvedCsv(
  items: ReadonlyArray<UniversalImportItem>,
): string {
  const rows = items.map((item) =>
    [
      toCsvField(item.title),
      toCsvField(item.year),
      toCsvField(item.action),
      toCsvField(item.watched_at),
      toCsvField(item.type),
      toCsvField(item.season),
      toCsvField(item.episode),
      toCsvField(item.ids.imdb),
      toCsvField(item.ids.tmdb),
      toCsvField(item.ids.tvdb),
      toCsvField(item.ids.trakt),
    ].join(','),
  );

  return [HEADER, ...rows].join('\n');
}
