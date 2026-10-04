import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { useMotionDuration } from './useMotionDuration.ts';

describe('store: useMotionDuration', () => {
  it('should keep the duration when motion is not reduced', async () => {
    const motion = await runQuery({ factory: () => useMotionDuration() });

    expect(motion?.(250)).toBe(250);
  });
});
