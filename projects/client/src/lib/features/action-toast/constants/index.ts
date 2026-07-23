import { time } from '$lib/utils/timing/time.ts';

/**
 * How long a confirmation toast stays up before auto-dismissing. Long enough
 * to read the message and reach for "Undo", short enough not to linger.
 */
export const ACTION_TOAST_DURATION = time.seconds(6);
