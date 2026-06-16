import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';
import type { SocialActivityEntry } from '$lib/sections/summary/components/social/models/SocialActivityEntry.ts';
import { toDisplayableName } from '$lib/utils/profile/toDisplayableName.ts';

export function mapToSocialActivityEntries(
  mediaSocial: MediaSocial,
): SocialActivityEntry[] {
  const activities: SocialActivityEntry[] = [];

  if (mediaSocial.watched) {
    activities.push({
      key: `${mediaSocial.key}-watched`,
      type: 'watch',
      playCount: mediaSocial.watched.plays,
    });
  }

  if (mediaSocial.watched?.rating) {
    activities.push({
      key: `${mediaSocial.key}-rated`,
      type: 'rating',
      rating: mediaSocial.watched.rating.rating,
    });
  }

  if (mediaSocial.watched?.comment) {
    activities.push({
      key: `${mediaSocial.key}-reviewed`,
      type: 'review',
      reviewId: mediaSocial.watched.comment.id,
      author: toDisplayableName(mediaSocial.user),
    });
  }

  if (mediaSocial.watchlisted) {
    activities.push({
      key: `${mediaSocial.key}-watchlisted`,
      type: 'watchlist',
    });
  }

  return activities;
}
