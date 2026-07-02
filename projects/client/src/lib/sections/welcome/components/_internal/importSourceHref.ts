import type { ImportSource } from '$lib/sections/settings/import/ImportTypes.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export function importSourceHref(source: ImportSource): string {
  return `${UrlBuilder.settings.data()}?source=${source}`;
}
