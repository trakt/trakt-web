import { languageTag } from '$lib/features/i18n/index.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';

export function toMixtapeMeta(media: MovieEntry | ShowEntry): string {
  const genre = media.genres.at(0);

  return [
    media.year,
    media.runtime > 0
      ? toHumanDuration({ minutes: media.runtime }, languageTag())
      : null,
    genre ? toTranslatedGenre(genre) : null,
  ]
    .filter(Boolean)
    .join(' · ');
}
