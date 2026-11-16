import { describe, expect, it } from 'vitest';
import { importedAny } from './importedAny.ts';

const retires = importedAny({ threshold: 20, steps: ['watched', 'rate'] });

function context({
  counts,
  byAction = [],
}: {
  counts: Partial<Record<'watched' | 'rate', number>>;
  byAction?: ReadonlyArray<string>;
}) {
  return {
    count: (stepId: 'watched' | 'rate') => counts[stepId] ?? 0,
    isDoneByAction: (stepId: 'watched' | 'rate') => byAction.includes(stepId),
  };
}

describe('rule: importedAny', () => {
  it('should not retire below the threshold', () => {
    expect(retires(context({ counts: { watched: 19 } }))).toBe(false);
  });

  it('should retire when a step reaches the threshold without an in-app action', () => {
    expect(retires(context({ counts: { rate: 20 } }))).toBe(true);
  });

  it('should keep going when the step was done in the app', () => {
    expect(
      retires(context({ counts: { watched: 480 }, byAction: ['watched'] })),
    ).toBe(false);
  });

  it('should retire when any listed step looks imported', () => {
    expect(
      retires(
        context({ counts: { watched: 480, rate: 120 }, byAction: ['watched'] }),
      ),
    ).toBe(true);
  });
});
