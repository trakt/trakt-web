import type { UniversalImportItem } from '../ImportTypes.ts';

export async function parseCsvText(text: string): Promise<unknown[]> {
  const Papa = await import('papaparse');
  const result = Papa.default.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data as unknown[];
}

export async function parseCsvFile(file: File): Promise<unknown[]> {
  const text = await file.text();
  return parseCsvText(text);
}

export async function parseJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  return JSON.parse(text);
}

export function isValidItem(item: UniversalImportItem): boolean {
  const hasId = Boolean(item.ids.trakt) ||
    Boolean(item.ids.imdb) ||
    Boolean(item.ids.tmdb) ||
    Boolean(item.ids.tvdb);

  const hasTitleAndYear = Boolean(item.title) && Boolean(item.year);

  return hasId || hasTitleAndYear;
}
