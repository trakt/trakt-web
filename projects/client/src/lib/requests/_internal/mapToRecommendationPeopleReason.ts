import type { RecommendationPeopleReason } from '../models/RecommendationPeopleReason.ts';
import type { PeopleReason } from '../models/RecommendationsResponse.ts';
import { mapToMovieEntry } from './mapToMovieEntry.ts';
import { mapToPersonSummary } from './mapToPersonSummary.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';

export function mapToRecommendationPeopleReason(
  reason: PeopleReason,
): RecommendationPeopleReason {
  return {
    person: mapToPersonSummary(reason.person),
    role: reason.role,
    watchedRoles: reason.watched_roles,
    watchedCount: reason.watched_count,
    titles: reason.titles.map((title) =>
      'movie' in title
        ? { mediaType: 'movie' as const, media: mapToMovieEntry(title.movie) }
        : { mediaType: 'show' as const, media: mapToShowEntry(title.show) },
    ),
  };
}
