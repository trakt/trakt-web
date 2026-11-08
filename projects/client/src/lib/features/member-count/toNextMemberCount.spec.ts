import { describe, expect, it } from 'vitest';
import { toNextMemberCount } from './toNextMemberCount.ts';

describe('util: toNextMemberCount', () => {
  it('should show the real total from the first response', () => {
    const result = toNextMemberCount({
      current: null,
      data: { total: 17_284_913 },
      status: 'success',
    });

    expect(result).toBe(17_284_913);
  });

  it('should show nothing while the first response is pending', () => {
    const result = toNextMemberCount({
      current: null,
      data: undefined,
      status: 'pending',
    });

    expect(result).toBeNull();
  });

  it('should fall back to the floor when the request failed', () => {
    const result = toNextMemberCount({
      current: null,
      data: undefined,
      status: 'error',
    });

    expect(result).toBe(17_000_000);
  });

  it('should fall back to the floor when the response had no total', () => {
    const result = toNextMemberCount({
      current: null,
      data: null,
      status: 'success',
    });

    expect(result).toBe(17_000_000);
  });

  it('should never rewind to a lower total', () => {
    const result = toNextMemberCount({
      current: 17_284_913,
      data: { total: 17_284_900 },
      status: 'success',
    });

    expect(result).toBe(17_284_913);
  });

  it('should move up when the total grows', () => {
    const result = toNextMemberCount({
      current: 17_284_913,
      data: { total: 17_284_950 },
      status: 'success',
    });

    expect(result).toBe(17_284_950);
  });

  it('should keep the shown total when a later request fails', () => {
    const result = toNextMemberCount({
      current: 17_284_913,
      data: undefined,
      status: 'error',
    });

    expect(result).toBe(17_284_913);
  });

  it('should keep the shown total while a refetch is pending', () => {
    const result = toNextMemberCount({
      current: 17_284_913,
      data: undefined,
      status: 'pending',
    });

    expect(result).toBe(17_284_913);
  });
});
