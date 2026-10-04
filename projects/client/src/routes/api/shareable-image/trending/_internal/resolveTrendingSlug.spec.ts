import { describe, expect, it, vi } from 'vitest';
import { resolveTrendingSlug } from './resolveTrendingSlug.ts';

const TODAY = new Date('2026-10-04T12:00:00Z');
const YESTERDAY = new Date('2026-10-03T00:00:00Z');

function createBucket(entries: Record<string, string> = {}) {
  const store = new Map(Object.entries(entries));

  return {
    store,
    get: vi.fn((key: string) => {
      const value = store.get(key);
      return Promise.resolve(
        value === undefined ? null : { text: () => Promise.resolve(value) },
      );
    }),
    put: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve(null);
    }),
  };
}

function resolve(
  { bucket, date = TODAY, slugs = ['reacher'] }: {
    bucket: ReturnType<typeof createBucket> | null;
    date?: Date;
    slugs?: string[];
  },
) {
  return resolveTrendingSlug({
    type: 'show',
    date,
    now: TODAY,
    bucket,
    fetchSlugs: () => Promise.resolve(slugs),
  });
}

describe('util: resolveTrendingSlug', () => {
  it('should keep the first pick of the day once the ranking changes', async () => {
    const bucket = createBucket();

    const first = await resolve({ bucket, slugs: ['reacher'] });
    const second = await resolve({ bucket, slugs: ['severance'] });

    expect(first).toBe('reacher');
    expect(second).toBe('reacher');
  });

  it('should store the pick for today', async () => {
    const bucket = createBucket();

    await resolve({ bucket });

    expect(bucket.store.get('images/share/trending/show/2026-10-04.txt'))
      .toBe('reacher');
  });

  it('should fall back to the pick for today for days without a pick', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-10-04.txt': 'severance',
    });

    expect(await resolve({ bucket, date: YESTERDAY })).toBe('severance');
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('should fetch the ranking once for repeated days without a pick', async () => {
    const bucket = createBucket();
    const fetchSlugs = vi.fn(() => Promise.resolve(['reacher']));
    const resolveYesterday = () =>
      resolveTrendingSlug({
        type: 'show',
        date: YESTERDAY,
        now: TODAY,
        bucket,
        fetchSlugs,
      });

    await resolveYesterday();
    await resolveYesterday();
    await resolveYesterday();

    expect(fetchSlugs).toHaveBeenCalledTimes(1);
    expect(bucket.store.has('images/share/trending/show/2026-10-03.txt'))
      .toBe(false);
  });

  it('should return the pick when storing it fails', async () => {
    const bucket = createBucket();
    bucket.put.mockRejectedValueOnce(new Error('put failed'));

    expect(await resolve({ bucket })).toBe('reacher');
  });

  it('should serve a stored pick for an earlier day', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-10-03.txt': 'severance',
    });

    expect(await resolve({ bucket, date: YESTERDAY })).toBe('severance');
  });

  it('should pick from the live ranking without a bucket', async () => {
    expect(await resolve({ bucket: null })).toBe('reacher');
  });

  it('should return undefined when nothing is trending', async () => {
    const bucket = createBucket();

    expect(await resolve({ bucket, slugs: [] })).toBeUndefined();
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('should fall back to the most recent pick when nothing is trending', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-09-30.txt': 'silo',
      'images/share/trending/show/2026-10-02.txt': 'severance',
    });

    expect(await resolve({ bucket, slugs: [] })).toBe('severance');
    expect(bucket.put).not.toHaveBeenCalled();
  });

  it('should fall back to the most recent pick when trending fails', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-10-03.txt': 'severance',
    });

    const slug = await resolveTrendingSlug({
      type: 'show',
      date: TODAY,
      now: TODAY,
      bucket,
      fetchSlugs: () => Promise.reject(new Error('trending failed')),
    });

    expect(slug).toBe('severance');
  });

  it('should not fall back to picks older than a week', async () => {
    const bucket = createBucket({
      'images/share/trending/show/2026-09-26.txt': 'severance',
    });

    expect(await resolve({ bucket, slugs: [] })).toBeUndefined();
  });
});
