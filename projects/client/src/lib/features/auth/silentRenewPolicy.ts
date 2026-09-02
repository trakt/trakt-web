import { time } from '$lib/utils/timing/time.ts';

export const silentRenewPolicy: {
  cooldownMs: number;
  maxConsecutiveFailures: number;
  failureResetMs: number;
} = {
  cooldownMs: time.seconds(30),
  maxConsecutiveFailures: 3,
  failureResetMs: time.minutes(5),
};
