import { describe, expect, it } from 'vitest';
import { didCompleteSeason } from './didCompleteSeason.ts';

const snapshot = (
  overrides: Partial<Parameters<typeof didCompleteSeason>[1]> = {},
) => ({ seasonNumber: 2, watched: 9, total: 10, loading: false, ...overrides });

describe('util: didCompleteSeason', () => {
  it('should fire when the last episode of the season gets watched', () => {
    expect(didCompleteSeason(snapshot(), snapshot({ watched: 10 }))).toBe(true);
  });

  it('should stay quiet on first render', () => {
    expect(didCompleteSeason(null, snapshot({ watched: 10 }))).toBe(false);
  });

  it('should stay quiet when switching to an already complete season', () => {
    expect(
      didCompleteSeason(
        snapshot(),
        snapshot({ seasonNumber: 3, watched: 8, total: 8 }),
      ),
    ).toBe(false);
  });

  it('should stay quiet while progress is loading', () => {
    expect(
      didCompleteSeason(snapshot({ loading: true }), snapshot({ watched: 10 })),
    ).toBe(false);
  });

  it('should stay quiet when a complete season stays complete', () => {
    expect(
      didCompleteSeason(snapshot({ watched: 10 }), snapshot({ watched: 10 })),
    ).toBe(false);
  });

  it('should stay quiet for a season with no episodes', () => {
    expect(
      didCompleteSeason(
        snapshot({ watched: 0, total: 0 }),
        snapshot({ watched: 0, total: 0 }),
      ),
    ).toBe(false);
  });
});
