import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toSearchTerms } from './toSearchTerms.ts';

describe('toSearchTerms', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should emit an empty term right away so combined streams render', () => {
    const { debounced$ } = toSearchTerms(new BehaviorSubject(''), 300);
    const seen: string[] = [];

    const subscription = combineLatest([of('ready'), debounced$])
      .subscribe(([, term]) => seen.push(term));

    expect(seen).toEqual(['']);
    subscription.unsubscribe();
  });

  it('should only pass the trimmed term on after the debounce', () => {
    const search$ = new BehaviorSubject('');
    const { typed$, debounced$ } = toSearchTerms(search$, 300);
    const typed: string[] = [];
    const debounced: string[] = [];
    const subscriptions = [
      typed$.subscribe((term) => typed.push(term)),
      debounced$.subscribe((term) => debounced.push(term)),
    ];

    search$.next(' glad ');
    expect(typed).toEqual(['', 'glad']);
    expect(debounced).toEqual(['']);

    vi.advanceTimersByTime(300);
    expect(debounced).toEqual(['', 'glad']);
    subscriptions.forEach((subscription) => subscription.unsubscribe());
  });
});
