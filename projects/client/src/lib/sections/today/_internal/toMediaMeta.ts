import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import type { TodayMedia } from '../models/TodayMedia.ts';

const MAX_GENRES = 3;

export function toMediaMeta(media: TodayMedia): string {
  return [
    media.year,
    ...media.genres.slice(0, MAX_GENRES).map((genre) =>
      toTranslatedGenre(genre)
    ),
  ]
    .filter(Boolean)
    .join(' · ');
}
