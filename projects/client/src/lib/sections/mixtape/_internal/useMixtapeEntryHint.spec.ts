import { BehaviorSubject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMixtapeEntryHint } from './useMixtapeEntryHint.ts';

describe('store: useMixtapeEntryHint', () => {
  const collect = ({ isActive = true, isTouch = true } = {}) => {
    const values: boolean[] = [];
    useMixtapeEntryHint({
      isActive: new BehaviorSubject(isActive),
      isTouch: new BehaviorSubject(isTouch),
    }).isShown.subscribe((value) => values.push(value));
    return values;
  };

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show the tagline once after landing on the mixtape entry by touch', () => {
    const values = collect();

    expect(values).toEqual([false]);

    vi.advanceTimersByTime(600);
    expect(values).toEqual([false, true]);

    vi.advanceTimersByTime(3200);
    expect(values).toEqual([false, true, false]);
  });

  it('should stay quiet with a mouse, where hover shows the tagline', () => {
    const values = collect({ isTouch: false });

    vi.advanceTimersByTime(5000);
    expect(values).toEqual([false]);
  });

  it('should wait until the mixtape row is the visible one', () => {
    const values = collect({ isActive: false });

    vi.advanceTimersByTime(5000);
    expect(values).toEqual([false]);
  });

  it('should remember that the tagline was shown', () => {
    collect();
    vi.advanceTimersByTime(5000);

    const values = collect();
    vi.advanceTimersByTime(5000);

    expect(values).toEqual([false]);
  });
});
