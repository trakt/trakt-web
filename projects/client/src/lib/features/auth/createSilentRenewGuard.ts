type CreateSilentRenewGuardParams = {
  now: () => number;
  cooldownMs: number;
  maxConsecutiveFailures: number;
  failureResetMs: number;
};

type RenewOutcome = 'attempted' | 'deferred' | 'blocked';

type RenewResult<T> = {
  outcome: RenewOutcome;
  value: T | null;
};

export function createSilentRenewGuard<T>({
  now,
  cooldownMs,
  maxConsecutiveFailures,
  failureResetMs,
}: CreateSilentRenewGuardParams) {
  let inflight: Promise<T> | null = null;
  let lastAttemptAt: number | null = null;
  let consecutiveFailures = 0;

  const sinceLastAttempt = () =>
    lastAttemptAt == null ? Infinity : now() - lastAttemptAt;

  return {
    async renew(attempt: () => Promise<T>): Promise<RenewResult<T>> {
      if (inflight) {
        return { outcome: 'deferred', value: await inflight.catch(() => null) };
      }

      if (sinceLastAttempt() >= failureResetMs) {
        consecutiveFailures = 0;
      }

      if (consecutiveFailures >= maxConsecutiveFailures) {
        return { outcome: 'blocked', value: null };
      }

      if (sinceLastAttempt() < cooldownMs) {
        return { outcome: 'blocked', value: null };
      }

      lastAttemptAt = now();

      try {
        inflight = attempt();
        const value = await inflight;
        consecutiveFailures = 0;
        return { outcome: 'attempted', value };
      } catch (error) {
        consecutiveFailures = consecutiveFailures + 1;
        throw error;
      } finally {
        inflight = null;
      }
    },
  };
}
