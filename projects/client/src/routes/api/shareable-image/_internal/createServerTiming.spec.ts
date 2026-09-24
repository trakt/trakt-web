import { describe, expect, it } from 'vitest';
import { createServerTiming } from './createServerTiming.ts';

function clockOf(...ticks: ReadonlyArray<number>) {
  const remaining = [...ticks];
  return () => remaining.shift() ?? 0;
}

describe('util: createServerTiming', () => {
  it('should return the result of the measured work', async () => {
    const timing = createServerTiming();

    expect(await timing.measure('data', () => Promise.resolve(42))).toBe(42);
  });

  it('should render each stage as a server timing metric', async () => {
    const timing = createServerTiming(clockOf(10, 52.25, 100, 107.5));

    await timing.measure('data', () => Promise.resolve());
    await timing.measure('fonts', () => Promise.resolve());

    expect(timing.toHeader()).toBe('data;dur=42.3, fonts;dur=7.5');
  });

  it('should record a stage that fails and rethrow', async () => {
    const timing = createServerTiming(clockOf(0, 12));

    await expect(
      timing.measure('data', () => Promise.reject(new Error('boom'))),
    ).rejects.toThrow('boom');
    expect(timing.toHeader()).toBe('data;dur=12.0');
  });

  it('should render nothing when no stage was measured', () => {
    expect(createServerTiming().toHeader()).toBe('');
  });
});
