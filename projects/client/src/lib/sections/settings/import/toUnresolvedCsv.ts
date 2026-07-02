import type { UniversalImportItem } from './ImportTypes.ts';

function toCsvField(value: string | number | undefined): string {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toUnresolvedCsv(
  items: ReadonlyArray<UniversalImportItem>,
): string {
  const rows = items.map((item) =>
    [
      toCsvField(item.title),
      toCsvField(item.year),
      toCsvField(item.action),
      toCsvField(item.watched_at),
    ].join(',')
  );

  return ['title,year,action,watched_at', ...rows].join('\n');
}
