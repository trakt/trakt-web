import { time } from '$lib/utils/timing/time.ts';

/**
 * Grace window after a VIP membership lapses during which a loyalty streak
 * stays "frozen" (protected from resetting). Seven days, expressed via the
 * `time` helper rather than a raw `7 * 24 * 60 * 60 * 1000` literal.
 */
export const GRACE_PERIOD_MS = time.days(7);
