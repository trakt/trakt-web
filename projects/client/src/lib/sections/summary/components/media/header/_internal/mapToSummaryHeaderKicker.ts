import * as m from '$lib/features/i18n/messages.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import type { MediaSummaryEntry } from '../../models/MediaSummaryEntry.ts';

const SEPARATOR = '·';

/**
 * The purple kicker above the title - media type plus primary genre, e.g.
 * "Movie · Comedy". Falls back to the type alone when the API carries no genre.
 */
export function mapToSummaryHeaderKicker(props: MediaSummaryEntry): string {
  const type = props.type === 'show'
    ? m.translated_value_type_show()
    : m.translated_value_type_movie();

  const genre = props.media.genres.at(0);

  return [type, genre ? toTranslatedGenre(genre) : null]
    .filter(Boolean)
    .join(` ${SEPARATOR} `);
}
