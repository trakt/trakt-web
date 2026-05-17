import { describe, expect, it } from 'vitest';
import { manifestKeyFor } from './_internal/manifest.ts';
import { selectKeepManifests } from './prune-immutable-r2.ts';

function manifestAt(sha: string, when: Date): string {
  return manifestKeyFor(sha, when);
}

describe('selectKeepManifests', () => {
  it('keeps last N when deploys are spread out (count rule dominates)', () => {
    const now = new Date('2026-05-17T12:00:00Z');
    const manifests = Array.from({ length: 15 }, (_, i) => {
      // One deploy per day, 14d ago → today.
      const when = new Date(now);
      when.setUTCDate(now.getUTCDate() - (14 - i));
      return manifestAt(`sha${i.toString().padStart(2, '0')}`, when);
    });

    const { keep, prune } = selectKeepManifests(manifests, now, 10, 24);
    // 10 newest by count + anything younger than 24h (just today's one,
    // already in the count window).
    expect(keep).toHaveLength(10);
    expect(prune).toHaveLength(5);
    expect(prune.every((p) => p < keep[0])).toBe(true);
  });

  it('keeps every recent burst even if it exceeds N (age rule dominates)', () => {
    const now = new Date('2026-05-17T12:00:00Z');
    const manifests = Array.from({ length: 15 }, (_, i) => {
      // 15 deploys in the past hour.
      const when = new Date(now.getTime() - (15 - i) * 60_000);
      return manifestAt(`sha${i.toString().padStart(2, '0')}`, when);
    });

    const { keep, prune } = selectKeepManifests(manifests, now, 10, 24);
    expect(keep).toHaveLength(15);
    expect(prune).toHaveLength(0);
  });

  it('takes the union of count and age windows', () => {
    const now = new Date('2026-05-17T12:00:00Z');
    const old = Array.from({ length: 8 }, (_, i) => {
      const when = new Date(now);
      when.setUTCDate(now.getUTCDate() - (15 + i)); // 15-22 days old
      return manifestAt(`old${i}`, when);
    });
    const recent = Array.from({ length: 12 }, (_, i) => {
      // 12 deploys in the past 3 hours
      const when = new Date(now.getTime() - (12 - i) * 15 * 60_000);
      return manifestAt(`new${i.toString().padStart(2, '0')}`, when);
    });

    const { keep, prune } = selectKeepManifests(
      [...old, ...recent],
      now,
      10,
      24,
    );
    // All 12 recent kept (age rule).
    // None of the old kept — newest 10 by count are the 10 newest of recent.
    expect(keep).toHaveLength(12);
    expect(keep.every((k) => k.includes('new'))).toBe(true);
    expect(prune).toHaveLength(8);
    expect(prune.every((p) => p.includes('old'))).toBe(true);
  });

  it('ignores manifests with unparseable names rather than keeping them', () => {
    const now = new Date('2026-05-17T12:00:00Z');
    const valid = manifestAt('abc', new Date(now.getTime() - 60_000));
    const junk = 'releases/some-stray-object.json';

    const { keep, prune } = selectKeepManifests([junk, valid], now, 1, 24);
    expect(keep).toContain(valid);
    // junk is older than the count window (lex-sorts before valid timestamp),
    // and has no parseable date → falls out of both rules → pruned.
    expect(prune).toContain(junk);
  });
});
