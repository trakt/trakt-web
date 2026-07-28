import { time } from '$lib/utils/timing/time.ts';

type ProjectCountParams = {
  value: number;
  elapsedMs: number;
  ratePerDay: number;
};

/**
 * Project a count forward from a local anchor at the measured signup rate.
 * Elapsed time is the caller's own, never the age of the server response.
 */
export function projectCount(
  { value, elapsedMs, ratePerDay }: ProjectCountParams,
): number {
  return value + Math.max(0, elapsedMs) * (ratePerDay / time.days(1));
}
