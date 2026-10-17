import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { withPendingIntent } from './withPendingIntent.ts';

function resolveIntent({
  current,
  isAdding,
  isRemoving,
}: {
  current: boolean;
  isAdding: boolean;
  isRemoving: boolean;
}) {
  return firstValueFrom(
    withPendingIntent({
      current: of(current),
      isAdding: of(isAdding),
      isRemoving: of(isRemoving),
    }),
  );
}

describe('withPendingIntent', () => {
  it('should follow the current state while nothing is pending', async () => {
    expect(
      await resolveIntent({
        current: true,
        isAdding: false,
        isRemoving: false,
      }),
    ).toBe(true);
    expect(
      await resolveIntent({
        current: false,
        isAdding: false,
        isRemoving: false,
      }),
    ).toBe(false);
  });

  it('should be true while an add is pending', async () => {
    expect(
      await resolveIntent({
        current: false,
        isAdding: true,
        isRemoving: false,
      }),
    ).toBe(true);
  });

  it('should be false while a remove is pending', async () => {
    expect(
      await resolveIntent({ current: true, isAdding: false, isRemoving: true }),
    ).toBe(false);
  });

  it('should let a pending remove win over a pending add', async () => {
    expect(
      await resolveIntent({ current: false, isAdding: true, isRemoving: true }),
    ).toBe(false);
  });

  it('should not repeat a state when the pending flag settles into it', () => {
    const current = new BehaviorSubject(false);
    const isAdding = new BehaviorSubject(true);
    const states: boolean[] = [];

    const subscription = withPendingIntent({
      current,
      isAdding,
      isRemoving: of(false),
    }).subscribe((value) => states.push(value));
    current.next(true);
    isAdding.next(false);
    subscription.unsubscribe();

    expect(states).to.deep.equal([true]);
  });
});
