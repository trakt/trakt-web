import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { time } from '$lib/utils/timing/time.ts';

type MediaStatusValue = 'new';

const newMediaWindowMs = time.days(7);

export function getMediaStatus(
  status: MediaStatus,
  effectiveReleaseDate: Date,
): MediaStatusValue | Nil {
  const elapsed = Date.now() - effectiveReleaseDate.getTime();

  const isPreReleased = status === 'released' && elapsed < 0;
  const isWithinNewWindow = elapsed >= 0 && elapsed <= newMediaWindowMs;

  if (isPreReleased || isWithinNewWindow) {
    return 'new';
  }

  return;
}
