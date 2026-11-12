import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MonthReviewTitle } from '../models/MonthReviewTitle.ts';

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
}: ToMonthReviewTitleParams): MonthReviewTitle {
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
