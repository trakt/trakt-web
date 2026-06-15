import { time } from '$lib/utils/timing/time.ts';
import { type OperatorFunction, ReplaySubject, share, timer } from 'rxjs';

const DEFAULT_GRACE_MS = time.seconds(1);

/**
 * Multicast an Observable so multiple subscribers share one upstream chain.
 *
 * Uses `share` with a fresh `ReplaySubject(1)` so late subscribers receive
 * the latest emission synchronously, and a `resetOnRefCountZero` timer so
 * brief 0-subscriber gaps (route swaps, transient remounts) don't tear the
 * upstream down. `resetOnComplete` / `resetOnError` are disabled so a
 * terminal source doesn't auto-reset the multicast - matches the semantics
 * we want for query / store observables which conceptually never complete.
 *
 * @param graceMs Grace window before tearing down after the last subscriber
 *   leaves. Defaults to 1s, which covers typical SvelteKit navigation gaps.
 */
export function multicast<T>(
  graceMs: number = DEFAULT_GRACE_MS,
): OperatorFunction<T, T> {
  return share<T>({
    connector: () => new ReplaySubject<T>(1),
    resetOnRefCountZero: () => timer(graceMs),
    resetOnComplete: false,
    resetOnError: false,
  });
}
