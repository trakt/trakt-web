import { time } from '$lib/utils/timing/time.ts';
import { defer, interval, map, share, startWith } from 'rxjs';

const clock = defer(() =>
  interval(time.seconds(1)).pipe(
    map(() => Date.now()),
    startWith(Date.now()),
  ),
).pipe(share());

export function useWatchingClock() {
  return clock;
}
