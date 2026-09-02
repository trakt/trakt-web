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

type RenewParams = {
  cooldownMs: number;
};

export function createSilentRenewGuard<T>({
  now,
  cooldownMs,
  maxConsecutiveFailures,
  failureResetMs,
}: CreateSilentRenewGuardParams) {
  let inflight: Promise<T> | null = null;
  let lastAttemptAt: number | null = null;
  let lastFailureAt: number | null = null;
  let lastResetAt: number | null = null;
  let consecutiveFailures = 0;

  const elapsedSince = (at: number | null) =>
    at == null ? Infinity : now() - at;

  return {
    reset() {
      if (elapsedSince(lastResetAt) < cooldownMs) {
        return;
      }

      lastResetAt = now();
      lastAttemptAt = null;
      lastFailureAt = null;
      consecutiveFailures = 0;
    },

    async renew(
      attempt: () => Promise<T>,
      { cooldownMs: attemptCooldownMs = cooldownMs }: Partial<RenewParams> = {},
    ): Promise<RenewResult<T>> {
      if (inflight) {
        return { outcome: 'deferred', value: await inflight.catch(() => null) };
      }

      if (elapsedSince(lastFailureAt) >= failureResetMs) {
        consecutiveFailures = 0;
      }

      if (consecutiveFailures >= maxConsecutiveFailures) {
        return { outcome: 'blocked', value: null };
      }

      if (elapsedSince(lastAttemptAt) < attemptCooldownMs) {
        return { outcome: 'blocked', value: null };
      }

      lastAttemptAt = now();

      try {
        inflight = attempt();
        const value = await inflight;
        consecutiveFailures = 0;
        lastFailureAt = null;
        return { outcome: 'attempted', value };
      } catch (error) {
        consecutiveFailures = consecutiveFailures + 1;
        lastFailureAt = now();
        throw error;
      } finally {
        inflight = null;
      }
    },
  };
}
