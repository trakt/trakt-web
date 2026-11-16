import { describe, expect, it } from 'vitest';
import { isSetFolded } from './isSetFolded.ts';

const LOADED_AT = new Date('2026-01-02T00:00:00Z').getTime();

describe('util: isSetFolded', () => {
  it('should fold a set completed before this visit loaded', () => {
    expect(
      isSetFolded({
        record: { completedAt: LOADED_AT - 1 },
        loadedAt: LOADED_AT,
      }),
    ).toBe(true);
  });

  it('should stay open for a set completed after this visit loaded', () => {
    expect(
      isSetFolded({
        record: { completedAt: LOADED_AT + 1 },
        loadedAt: LOADED_AT,
      }),
    ).toBe(false);
  });

  it('should stay open when it was never completed', () => {
    expect(
      isSetFolded({ record: { completedAt: null }, loadedAt: LOADED_AT }),
    ).toBe(false);
  });

  it('should stay open when it never started', () => {
    expect(isSetFolded({ record: null, loadedAt: LOADED_AT })).toBe(false);
  });
});
