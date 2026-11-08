import { time } from '$lib/utils/timing/time.ts';

type RecheckTier = {
  maxDaysSinceRelease: number;
  recheckIntervalMs: number;
};

const RECHECK_TIERS: ReadonlyArray<RecheckTier> = [
  { maxDaysSinceRelease: 14, recheckIntervalMs: time.hours(12) },
  { maxDaysSinceRelease: 40, recheckIntervalMs: time.days(3) },
  { maxDaysSinceRelease: 120, recheckIntervalMs: time.days(7) },
];
const FALLBACK_RECHECK_INTERVAL_MS = time.days(30);

type ShareImageTimeToLiveProps = {
  cachedAt: number;
  releasedAt: number;
  now: number;
};

function getRecheckIntervalMs(daysSinceRelease: number): number {
  const tier = RECHECK_TIERS.find(
    (t) => daysSinceRelease <= t.maxDaysSinceRelease,
  );

  return tier?.recheckIntervalMs ?? FALLBACK_RECHECK_INTERVAL_MS;
}

export function shareImageTimeToLive({
  cachedAt,
  releasedAt,
  now,
}: ShareImageTimeToLiveProps): number {
  const daysSinceRelease = (now - releasedAt) / time.days(1);

  return getRecheckIntervalMs(daysSinceRelease) - (now - cachedAt);
}
