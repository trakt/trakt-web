import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

type MediaInfoPathParams = {
  type: MediaType;
  slug: string;
  infoType: number;
  locale: AvailableLocale;
};

// `locale` carries the full tag; the API resolves it to an exact, same-language,
// or English row, so every info query must send it or readers get English.
export function toMediaInfoPath(
  { type, slug, infoType, locale }: MediaInfoPathParams,
) {
  const params = new URLSearchParams({ locale });

  return `/v3/media/${type}/${slug}/info/${infoType}/version/1?${params.toString()}`;
}
