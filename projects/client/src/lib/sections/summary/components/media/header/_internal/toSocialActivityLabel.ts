import * as m from '$lib/features/i18n/messages.ts';
import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';

/**
 * What a follow did with this title, as one short label.
 *
 * A single entry can carry several activities at once - watched, rated, reviewed
 * and watchlisted are not exclusive - so this picks the most engaged one to
 * report. Ordering mirrors the weighting in `sortMediaSocialEntries`: reviewing
 * signals more than a plain watch, which signals more than a watchlist add.
 *
 * Any *score* is deliberately NOT formatted here. Ratings are stored on a 1-10
 * scale but presented as 5 stars everywhere in the app, so rendering the raw
 * number contradicts the ratings drawer for the same entry. The caller renders
 * the score through `UserRating`, which is the single place that conversion
 * lives (see `toUserRating`).
 */
export function toSocialActivityLabel(entry: MediaSocial): string {
  const watched = entry.watched;

  if (watched?.comment) {
    return m.tag_text_reviewed();
  }

  if (watched) {
    return watched.plays > 1
      ? m.tag_text_plays({ number: watched.plays })
      : m.tag_text_watched();
  }

  return m.tag_text_watchlisted();
}
