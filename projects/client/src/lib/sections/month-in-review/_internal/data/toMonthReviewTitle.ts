import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { ReviewTitle } from '$lib/sections/review/models/ReviewTitle.ts';

type ToMonthReviewTitleParams = {
  entry: MediaEntry;
  plays: number;
  minutes?: number;
  rating?: number;
};

export function toMonthReviewTitle({
  entry,
  plays,
  minutes,
  rating,
}: ToMonthReviewTitleParams): ReviewTitle {
  return {
    key: entry.key,
    id: entry.id,
    type: entry.type,
    slug: entry.slug,
    title: entry.title,
    poster: entry.poster.url.medium,
    cover: entry.cover.url.medium,
    plays,
    ...(minutes === undefined ? {} : { minutes }),
    ...(rating === undefined ? {} : { rating }),
  };
}
