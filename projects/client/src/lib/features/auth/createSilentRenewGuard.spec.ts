import { describe, expect, it, vi } from 'vitest';
import { createSilentRenewGuard } from './createSilentRenewGuard.ts';

const cooldown = 30_000;
const maxFailures = 3;
const failureReset = 300_000;

function makeGuard(clock: { value: number }) {
  return createSilentRenewGuard({
    now: () => clock.value,
    cooldownMs: cooldown,
    maxConsecutiveFailures: maxFailures,
    failureResetMs: failureReset,
  });
}

describe('createSilentRenewGuard', () => {
  it('should run the first attempt', async () => {
    const clock = { value: 0 };
    const attempt = vi.fn().mockResolvedValue(undefined);

    await makeGuard(clock).renew(attempt);

    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it('should skip a second attempt within the cooldown', async () => {
    const clock = { value: 0 };
    const attempt = vi.fn().mockResolvedValue(undefined);
    const guard = makeGuard(clock);

    await guard.renew(attempt);
    clock.value = cooldown - 1;
    await guard.renew(attempt);

    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it('should allow an attempt once the cooldown lapses', async () => {
    const clock = { value: 0 };
    const attempt = vi.fn().mockResolvedValue(undefined);
    const guard = makeGuard(clock);

    await guard.renew(attempt);
    clock.value = cooldown;
    await guard.renew(attempt);

    expect(attempt).toHaveBeenCalledTimes(2);
  });

  it('should not run a second attempt while one is in flight', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);

    const attempt = vi.fn().mockImplementation(() =>
      new Promise((resolve) => setTimeout(resolve, 0))
    );

    const first = guard.renew(attempt);
    clock.value = cooldown;
    await guard.renew(attempt);
    await first;

    expect(attempt).toHaveBeenCalledTimes(1);
  });

  it('should rethrow so the caller can handle the failure', async () => {
    const clock = { value: 0 };
    const error = new Error('nope');

    await expect(makeGuard(clock).renew(() => Promise.reject(error)))
      .rejects.toThrow(error);
  });

  it('should stop attempting after consecutive failures', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockRejectedValue(new Error('nope'));

    for (let i = 0; i <= maxFailures; i++) {
      clock.value = i * cooldown;
      await guard.renew(attempt).catch(() => null);
    }

    expect(attempt).toHaveBeenCalledTimes(maxFailures);
  });

  it('should forget stale failures once the reset window lapses', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockRejectedValue(new Error('nope'));

    for (let i = 0; i < maxFailures; i++) {
      clock.value = i * cooldown;
      await guard.renew(attempt).catch(() => null);
    }

    clock.value = (maxFailures - 1) * cooldown + failureReset;
    await guard.renew(attempt).catch(() => null);

    expect(attempt).toHaveBeenCalledTimes(maxFailures + 1);
  });

  it('should ignore a reset that follows another within the cooldown', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockRejectedValue(new Error('nope'));

    for (let i = 0; i < maxFailures; i++) {
      clock.value += cooldown;
      await guard.renew(attempt).catch(() => null);
    }

    guard.reset();
    await guard.renew(attempt).catch(() => null);
    clock.value += cooldown - 1;
    guard.reset();
    const blocked = await guard.renew(attempt);

    expect(attempt).toHaveBeenCalledTimes(maxFailures + 1);
    expect(blocked.outcome).toBe('blocked');
  });

  it('should reset the failure count after a success', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const failing = vi.fn().mockRejectedValue(new Error('nope'));
    const passing = vi.fn().mockResolvedValue(undefined);

    await guard.renew(failing).catch(() => null);
    clock.value = cooldown;
    await guard.renew(passing);

    clock.value = cooldown * 2;
    await guard.renew(failing).catch(() => null);
    clock.value = cooldown * 3;
    await guard.renew(failing).catch(() => null);
    clock.value = cooldown * 4;
    await guard.renew(failing).catch(() => null);

    expect(failing).toHaveBeenCalledTimes(maxFailures + 1);
  });
  it('should report whether the attempt actually ran', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockResolvedValue('fresh');

    const attempted = await guard.renew(attempt);
    const blocked = await guard.renew(attempt);

    expect(attempted).toEqual({ outcome: 'attempted', value: 'fresh' });
    expect(blocked).toEqual({ outcome: 'blocked', value: null });
  });

  it('should hand a deferred caller what the in-flight attempt minted', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);

    let settle: (value: string) => void = () => {};
    const owner = guard.renew(() =>
      new Promise<string>((resolve) => {
        settle = resolve;
      })
    );

    const deferred = guard.renew(() => Promise.resolve('second'));
    settle('first');

    expect(await deferred).toEqual({ outcome: 'deferred', value: 'first' });
    expect(await owner).toEqual({ outcome: 'attempted', value: 'first' });
  });

  it('should not report back for a deferred caller when the shared attempt fails', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);

    let reject: (reason: unknown) => void = () => {};
    const owner = guard.renew(() =>
      new Promise<string>((_, fail) => {
        reject = fail;
      })
    );
    const deferred = guard.renew(() => Promise.resolve('second'));

    reject(new Error('nope'));

    await expect(owner).rejects.toThrow('nope');
    expect(await deferred).toEqual({ outcome: 'deferred', value: null });
  });
  it('should let a reconnect outrun the cooldown', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockResolvedValue(undefined);

    await guard.renew(attempt);
    guard.reset();
    await guard.renew(attempt);

    expect(attempt).toHaveBeenCalledTimes(2);
  });

  it('should reopen the breaker on reset', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockRejectedValue(new Error('nope'));

    for (let i = 0; i < maxFailures; i++) {
      clock.value += cooldown;
      await guard.renew(attempt).catch(() => null);
    }

    expect((await guard.renew(attempt)).outcome).toBe('blocked');

    clock.value += cooldown;
    guard.reset();
    await guard.renew(attempt).catch(() => null);

    expect(attempt).toHaveBeenCalledTimes(maxFailures + 1);
  });

  it('should let a caller override the cooldown it waits behind', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockResolvedValue(undefined);

    await guard.renew(attempt);
    clock.value = 5_000;
    await guard.renew(attempt, { cooldownMs: 1_000 });

    expect(attempt).toHaveBeenCalledTimes(2);
  });

  it('should still block an overriding caller inside its own cooldown', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockResolvedValue(undefined);

    await guard.renew(attempt);
    clock.value = 500;
    const blocked = await guard.renew(attempt, { cooldownMs: 1_000 });

    expect(attempt).toHaveBeenCalledTimes(1);
    expect(blocked.outcome).toBe('blocked');
  });

  it('should hold an overriding caller behind the shared breaker', async () => {
    const clock = { value: 0 };
    const guard = makeGuard(clock);
    const attempt = vi.fn().mockRejectedValue(new Error('nope'));

    for (let i = 0; i < maxFailures; i++) {
      clock.value = i * cooldown;
      await guard.renew(attempt).catch(() => null);
    }

    clock.value = maxFailures * cooldown;
    const blocked = await guard.renew(attempt, { cooldownMs: 0 });

    expect(attempt).toHaveBeenCalledTimes(maxFailures);
    expect(blocked.outcome).toBe('blocked');
  });
});
