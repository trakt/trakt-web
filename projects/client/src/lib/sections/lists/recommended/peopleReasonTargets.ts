import type { BulkIntlTarget } from '$lib/features/intl-overlay/BulkIntlTarget.ts';
import type { RecommendationPeopleReason } from '$lib/requests/models/RecommendationPeopleReason.ts';

export function peopleReasonTargets(
  reason: RecommendationPeopleReason,
): ReadonlyArray<BulkIntlTarget<RecommendationPeopleReason>> {
  return reason.titles.map(({ mediaType, media }) => ({
    id: media.id,
    type: mediaType,
    apply: (acc, title) => ({
      ...acc,
      titles: acc.titles.map((item) =>
        item.mediaType === mediaType && item.media.id === media.id
          ? ({ ...item, media: { ...item.media, title } } as typeof item)
          : item,
      ),
    }),
  }));
}
