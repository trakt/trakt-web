import { time } from '$lib/utils/timing/time.ts';

const POLL_INTERVAL = time.minutes(2);
const MAX_POLLS = 30;

type PolledQuery = {
  readonly state: { readonly dataUpdateCount: number };
};

export function watchingNowPollInterval(query: PolledQuery) {
  if (query.state.dataUpdateCount >= MAX_POLLS) return false;

  return POLL_INTERVAL;
}
