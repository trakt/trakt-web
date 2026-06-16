import { BehaviorSubject, type Observable } from 'rxjs';
import { onDestroy } from 'svelte';

/**
 * Bridge a Svelte 5 rune-driven accessor into an RxJS Observable.
 *
 * The accessor is read once for the seed value, then `$effect.pre` re-reads
 * it whenever any tracked rune dependency changes and pushes the new value
 * through a `BehaviorSubject`. Late subscribers receive the latest value
 * synchronously.
 *
 * `$effect.pre` (not `$effect`) so the observable updates BEFORE the
 * component's own `$effect.pre` callbacks run. Otherwise a consumer reading
 * a downstream observable in `$effect.pre` (e.g. a route's redirect logic)
 * sees the previous accessor value until the next flush.
 *
 * Use when a function (e.g. a `use*` hook in a plain `.ts` file) needs to
 * react to rune-backed state from a `.svelte` caller without re-running
 * the hook itself. Call this once at component-setup time.
 */
export function fromRune<T>(accessor: () => T): Observable<T> {
  const subject = new BehaviorSubject<T>(accessor());
  $effect.pre(() => {
    subject.next(accessor());
  });
  // Complete the subject on component teardown so downstream subscribers
  // (and the bridge's `complete: () => subscriber.complete()` handler)
  // tear down cleanly instead of relying on GC of the orphaned subject.
  onDestroy(() => {
    subject.complete();
  });
  return subject.asObservable();
}
