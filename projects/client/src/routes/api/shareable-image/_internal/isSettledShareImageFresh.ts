import { time } from '$lib/utils/timing/time.ts';

const OPEN_PERIOD_MAX_AGE = time.hours(1);

type IsSettledShareImageFreshProps = {
  cachedAt: Date;
  now: Date;
  settlesAt: Date;
};

export function isSettledShareImageFresh({
  cachedAt,
  now,
  settlesAt,
}: IsSettledShareImageFreshProps): boolean {
  if (now >= settlesAt) {
    return cachedAt >= settlesAt;
  }

  return now.getTime() - cachedAt.getTime() < OPEN_PERIOD_MAX_AGE;
}
