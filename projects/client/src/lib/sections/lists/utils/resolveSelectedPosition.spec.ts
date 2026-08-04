import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type {
  MediaCredit,
  MediaCredits,
} from '$lib/requests/models/MediaCredits.ts';
import { describe, expect, it } from 'vitest';
import { resolveSelectedPosition } from './resolveSelectedPosition.ts';

function creditsOf(
  counts: Partial<Record<CrewPosition, number>>,
): MediaCredits {
  return new Map(
    Object.entries(counts).map(([position, count]) => [
      position as CrewPosition,
      Array(count).fill({}) as MediaCredit[],
    ]),
  );
}

describe('util: resolveSelectedPosition', () => {
  it('should honor the requested position when it has credits', () => {
    const credits = creditsOf({ acting: 10, directing: 1 });

    const result = resolveSelectedPosition({
      requested: 'directing',
      credits,
    });

    expect(result).toBe('directing');
  });

  it('should fall back to the highest-count position when requested has no credits', () => {
    const credits = creditsOf({ acting: 2, directing: 5 });

    const result = resolveSelectedPosition({ requested: 'writing', credits });

    expect(result).toBe('directing');
  });

  it('should fall back to self when it is the only credit area', () => {
    const credits = creditsOf({ self: 3 });

    const result = resolveSelectedPosition({ requested: 'acting', credits });

    expect(result).toBe('self');
  });

  it('should fall back to unknown when it is the only credit area', () => {
    const credits = creditsOf({ unknown: 2 });

    const result = resolveSelectedPosition({ requested: 'acting', credits });

    expect(result).toBe('unknown');
  });

  it('should prefer acting over self even when self has more credits', () => {
    const credits = creditsOf({ acting: 1, self: 5 });

    const result = resolveSelectedPosition({ requested: 'unknown', credits });

    expect(result).toBe('acting');
  });

  it('should return the requested position when no credits have loaded yet', () => {
    const result = resolveSelectedPosition({
      requested: 'acting',
      credits: new Map(),
    });

    expect(result).toBe('acting');
  });

  it('should return the requested position when credits is undefined', () => {
    const result = resolveSelectedPosition({ requested: 'acting' });

    expect(result).toBe('acting');
  });
});
