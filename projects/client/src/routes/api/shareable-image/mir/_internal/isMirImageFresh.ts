import { time } from '$lib/utils/timing/time.ts';

const OPEN_MONTH_MAX_AGE = time.hours(1);

type IsMirImageFreshProps = {
  cachedAt: Date;
  now: Date;
  settlesAt: Date;
};

export function isMirImageFresh({
  cachedAt,
  now,
  settlesAt,
}: IsMirImageFreshProps): boolean {
  if (now >= settlesAt) {
    return cachedAt >= settlesAt;
  }

  return now.getTime() - cachedAt.getTime() < OPEN_MONTH_MAX_AGE;
}
