import { time } from '$lib/utils/timing/time.ts';

const HIDDEN_FOR_MS = time.days(14);

type IsNudgeHiddenParams = {
  hiddenAt: string | Nil;
  now: number;
};

export function isNudgeHidden({ hiddenAt, now }: IsNudgeHiddenParams) {
  const elapsed = now - Number(hiddenAt);

  return elapsed >= 0 && elapsed < HIDDEN_FOR_MS;
}
