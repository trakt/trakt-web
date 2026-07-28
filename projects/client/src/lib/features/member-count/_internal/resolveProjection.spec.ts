import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';
import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { resolveProjection } from './resolveProjection.ts';

describe('util: resolveProjection', () => {
  const RATE_PER_DAY = 8_640; // exactly one per 10 seconds
  const WALL_NOW = Date.parse('2026-07-28T19:00:00.000Z');

  const serverAt = (
    { total, ageMs = 0 }: { total: number; ageMs?: number },
  ): RegisteredMemberCount => ({
    total,
    anchoredAt: WALL_NOW - ageMs,
    ratePerDay: RATE_PER_DAY,
  });

  describe('when the server lags the projection', () => {
    it('should keep projecting from the existing anchor', () => {
      const local = { value: 17_002_054, at: 1_000 };

      const { local: next, target } = resolveProjection({
        local,
        server: serverAt({ total: 17_002_054 }),
        now: 1_000 + time.seconds(30),
        wallNow: WALL_NOW,
      });

      expect(next).toBe(local);
      expect(target).toBe(17_002_057);
    });

    // The regression this whole shape exists for: a frozen total with a fresh
    // `updated_at` on every poll used to reset elapsed time and collapse the
    // projection, so the counter crept once and stuck.
    it('should keep climbing across repeated polls of a frozen total', () => {
      const server = serverAt({ total: 17_002_054 });
      const start = 1_000;

      const targets = [10, 20, 30, 40].map((seconds) =>
        resolveProjection({
          local: { value: 17_002_054, at: start },
          server,
          now: start + time.seconds(seconds),
          wallNow: WALL_NOW,
        }).target
      );

      expect(targets).toEqual([
        17_002_055,
        17_002_056,
        17_002_057,
        17_002_058,
      ]);
    });
  });

  describe('when the server runs ahead of the projection', () => {
    it('should re-anchor onto the server total', () => {
      const now = 1_000 + time.seconds(10);

      const { local: next, target } = resolveProjection({
        local: { value: 17_002_054, at: 1_000 },
        server: serverAt({ total: 17_009_000 }),
        now,
        wallNow: WALL_NOW,
      });

      expect(next).toEqual({ value: 17_009_000, at: now });
      expect(target).toBe(17_009_000);
    });
  });

  describe('when the response is too old to trust', () => {
    it('should hold the last reported total rather than discard it', () => {
      const now = 5_000;

      const { local: next, target } = resolveProjection({
        local: { value: 17_000_000, at: 1_000 },
        server: serverAt({ total: 17_002_054, ageMs: time.minutes(10) }),
        now,
        wallNow: WALL_NOW,
      });

      expect(next).toEqual({ value: 17_002_054, at: now });
      expect(target).toBe(17_002_054);
    });

    it('should not project any further while stale', () => {
      const server = serverAt({ total: 17_002_054, ageMs: time.minutes(10) });
      const local = { value: 17_002_060, at: 1_000 };

      const first = resolveProjection({
        local,
        server,
        now: 1_000 + time.seconds(30),
        wallNow: WALL_NOW,
      });
      const second = resolveProjection({
        local: first.local,
        server,
        now: 1_000 + time.seconds(60),
        wallNow: WALL_NOW,
      });

      expect(first.target).toBe(17_002_060);
      expect(second.target).toBe(17_002_060);
    });

    it('should resume from where it froze once the endpoint recovers', () => {
      const frozen = resolveProjection({
        local: { value: 17_002_060, at: 1_000 },
        server: serverAt({ total: 17_002_054, ageMs: time.minutes(10) }),
        now: time.minutes(30),
        wallNow: WALL_NOW,
      });

      const recovered = resolveProjection({
        local: frozen.local,
        server: serverAt({ total: 17_002_054 }),
        now: time.minutes(30) + time.seconds(10),
        wallNow: WALL_NOW,
      });

      // One step of rate, not thirty minutes of it.
      expect(recovered.target).toBe(17_002_061);
    });
  });
});
