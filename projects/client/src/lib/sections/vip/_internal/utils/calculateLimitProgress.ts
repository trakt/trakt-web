type LimitProgressProps = {
  freeLimit: number;
  vipLimit: number;
  current: number;
  variant: 'free' | 'vip';
};

const FREE_PERCENTAGE_CAP = 30;

export function calculateLimitProgress(
  { freeLimit, vipLimit, current, variant }: LimitProgressProps,
) {
  const divisor = variant === 'free' ? freeLimit : vipLimit;
  const maxPercentage = variant === 'free' ? FREE_PERCENTAGE_CAP : 100;

  const progress = Math.min((current / divisor) * maxPercentage, maxPercentage);
  const isOverLimit = current > divisor;
  const limitedPercentage = variant === 'free'
    ? FREE_PERCENTAGE_CAP
    : undefined;

  return { progress, isOverLimit, limitedPercentage };
}
