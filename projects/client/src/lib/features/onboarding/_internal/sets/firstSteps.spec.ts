import { describe, expect, it } from 'vitest';
import { firstSteps } from './firstSteps.ts';

function retires({
  counts,
  byAction = [],
}: {
  counts: Readonly<Record<string, number>>;
  byAction?: ReadonlyArray<string>;
}) {
  return firstSteps.retireWhen({
    count: (stepId) => counts[stepId] ?? 0,
    isDoneByAction: (stepId) => byAction.includes(stepId),
  });
}

describe('set: firstSteps', () => {
  it('should surface for a fresh account', () => {
    expect(retires({ counts: {} })).toBe(false);
  });

  it('should retire once history arrives from an import', () => {
    expect(retires({ counts: { watched: 480 } })).toBe(true);
  });

  it('should keep going when the history was built in the app', () => {
    expect(retires({ counts: { watched: 480 }, byAction: ['watched'] })).toBe(
      false,
    );
  });

  it('should retire once ratings arrive from an import', () => {
    expect(retires({ counts: { rate: 120 } })).toBe(true);
  });

  it('should retire once a watchlist arrives from an import', () => {
    expect(retires({ counts: { watchlist: 120 } })).toBe(true);
  });

  it('should keep going when 20 watchlist items were added in the app', () => {
    expect(
      retires({ counts: { watchlist: 20 }, byAction: ['watchlist'] }),
    ).toBe(false);
  });

  it('should ignore follows when deciding to retire', () => {
    expect(retires({ counts: { follow: 200 } })).toBe(false);
  });

  it('should have five steps', () => {
    expect(firstSteps.steps).toHaveLength(5);
  });
});
