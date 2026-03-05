import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

type MapToSummaryStatusProps = {
  media: MediaEntry;
  now: Date;
};

export function mapToSummaryStatus({ media, now }: MapToSummaryStatusProps) {
  if (media.status !== 'released') {
    return media.status;
  }

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return media.airDate > oneMonthAgo ? media.status : undefined;
}
