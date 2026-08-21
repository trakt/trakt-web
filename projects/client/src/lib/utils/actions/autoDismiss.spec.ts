import { time } from '$lib/utils/timing/time.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { autoDismiss } from './autoDismiss.ts';

describe('action: autoDismiss', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const setup = (durationMs: number) => {
    const onDismiss = vi.fn();
    let clock = 0;
    const action = autoDismiss(document.createElement('div'), {
      onDismiss,
      durationMs,
      now: () => clock,
    });

    return {
      onDismiss,
      action,
      advance: (ms: number) => {
        clock += ms;
        vi.advanceTimersByTime(ms);
      },
    };
  };

  it('should dismiss once the duration elapses', () => {
    const { onDismiss, advance } = setup(time.seconds(6));

    advance(time.seconds(6));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should restart the countdown when resetKey changes', () => {
    const { onDismiss, action, advance } = setup(time.seconds(6));

    advance(time.seconds(5));
    action.update({ onDismiss, durationMs: time.seconds(6), resetKey: 'next' });
    advance(time.seconds(5));

    expect(onDismiss).not.toHaveBeenCalled();

    advance(time.seconds(1));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
