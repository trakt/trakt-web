import { time } from '$lib/utils/timing/time.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pruneShareImages } from './pruneShareImages.ts';

const NOW = new Date('2026-06-04T12:00:00Z').getTime();

type BucketObject = {
  key: string;
  customMetadata?: Record<string, string>;
};

function makeBucket(objects: BucketObject[]) {
  const deleted: string[] = [];

  const bucket = {
    list: vi.fn((opts?: { prefix?: string; cursor?: string }) => {
      const prefix = opts?.prefix;
      const filtered = prefix
        ? objects.filter((o) => o.key.startsWith(prefix))
        : objects;
      return Promise.resolve({
        objects: filtered,
        truncated: false,
        cursor: undefined,
      });
    }),
    delete: vi.fn((key: string) => {
      deleted.push(key);
      return Promise.resolve();
    }),
    deleted,
  };

  return bucket;
}

function cachedAt(msBefore: number): string {
  return new Date(NOW - msBefore).toISOString();
}

function releasedAt(daysAgo: number): string {
  return new Date(NOW - daysAgo * time.days(1)).toISOString();
}

const prefixes = ['images/share/og/movie/', 'images/share/og/show/'];

describe('pruneShareImages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('staleness tiers', () => {
    it('prunes a fresh release cached over 12 hours ago (tier 1: ≤14 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(13)),
            releasedAt: releasedAt(7),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
      expect(result.skipped).toBe(0);
    });

    it('skips a fresh release cached under 12 hours ago (tier 1: ≤14 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(11)),
            releasedAt: releasedAt(7),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('prunes a mid-age release cached over 3 days ago (tier 2: 15-40 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/oppenheimer/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(4)),
            releasedAt: releasedAt(20),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('skips a mid-age release cached under 3 days ago (tier 2: 15-40 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/oppenheimer/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(2)),
            releasedAt: releasedAt(20),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.skipped).toBe(1);
    });

    it('prunes older release cached over 7 days ago (tier 3: 41-120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/show/breaking-bad/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(8)),
            releasedAt: releasedAt(60),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('prunes catalog content cached over 30 days ago (fallback: >120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/show/the-wire/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(31)),
            releasedAt: releasedAt(365 * 10),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('skips catalog content cached under 30 days ago (fallback: >120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/show/the-wire/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(20)),
            releasedAt: releasedAt(365 * 10),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.skipped).toBe(1);
    });
  });

  describe('threshold boundaries', () => {
    it('prunes when the cached age exactly equals the recheck interval', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(12)),
            releasedAt: releasedAt(7),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
      expect(result.skipped).toBe(0);
    });

    it('keeps a release aged exactly 14 days in tier 1', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(13)),
            releasedAt: releasedAt(14),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
      expect(result.skipped).toBe(0);
    });

    it('moves a release aged just over 14 days into tier 2', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(13)),
            releasedAt: releasedAt(14 + 1 / 24),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });
  });

  describe('legacy entries (missing releasedAt)', () => {
    it('always prunes entries missing releasedAt metadata', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/legacy-film/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.hours(1)),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
      expect(result.skipped).toBe(0);
    });
  });

  describe('legacy epoch metadata', () => {
    it('still reads objects written before the ISO switch', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/epoch-film/image.png',
          customMetadata: {
            cachedAt: String(NOW - time.hours(11)),
            releasedAt: String(NOW - time.days(7)),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });
  });

  describe('missing cachedAt', () => {
    it('skips entries with no cachedAt metadata', async () => {
      const bucket = makeBucket([
        {
          key: 'images/share/og/movie/unknown/image.png',
          customMetadata: { releasedAt: releasedAt(10) },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('skips entries with no metadata at all', async () => {
      const bucket = makeBucket([
        { key: 'images/share/og/movie/no-meta/image.png' },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });
  });

  describe('prefix scoping', () => {
    it('only lists objects under the given prefixes', async () => {
      const bucket = makeBucket([]);

      await pruneShareImages(bucket, [
        'images/share/og/movie/',
        'images/share/feed/show/',
      ]);

      expect(bucket.list).toHaveBeenCalledTimes(2);
      expect(bucket.list).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: 'images/share/og/movie/' }),
      );
      expect(bucket.list).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: 'images/share/feed/show/' }),
      );
    });

    it('does not delete objects outside the given prefixes', async () => {
      const bucket = makeBucket([
        {
          key: 'immutable/some-asset.js',
          customMetadata: {
            cachedAt: cachedAt(time.days(365)),
            releasedAt: releasedAt(365),
          },
        },
      ]);

      await pruneShareImages(bucket, ['images/share/og/movie/']);

      expect(bucket.deleted).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('counts delete errors and continues processing remaining objects', async () => {
      const objects: BucketObject[] = [
        {
          key: 'images/share/og/movie/film-a/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(31)),
            releasedAt: releasedAt(200),
          },
        },
        {
          key: 'images/share/og/movie/film-b/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(31)),
            releasedAt: releasedAt(200),
          },
        },
      ];

      const bucket = makeBucket(objects);
      bucket.delete.mockRejectedValueOnce(new Error('R2 error'));

      const result = await pruneShareImages(bucket, ['images/share/og/movie/']);

      expect(result.errors).toBe(1);
      expect(result.deleted).toBe(1);
    });
  });

  describe('pagination', () => {
    it('follows cursor until truncated is false', async () => {
      const page1: BucketObject[] = [
        {
          key: 'images/share/og/movie/film-a/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(31)),
            releasedAt: releasedAt(200),
          },
        },
      ];
      const page2: BucketObject[] = [
        {
          key: 'images/share/og/movie/film-b/image.png',
          customMetadata: {
            cachedAt: cachedAt(time.days(31)),
            releasedAt: releasedAt(200),
          },
        },
      ];

      const listMock = vi.fn()
        .mockResolvedValueOnce({
          objects: page1,
          truncated: true,
          cursor: 'token-1',
        })
        .mockResolvedValueOnce({
          objects: page2,
          truncated: false,
          cursor: undefined,
        });

      const bucket = {
        list: listMock,
        delete: vi.fn(async () => {}),
        deleted: [] as string[],
      };

      const result = await pruneShareImages(bucket, ['images/share/og/movie/']);

      expect(listMock).toHaveBeenCalledTimes(2);
      expect(listMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ cursor: 'token-1' }),
      );
      expect(result.deleted).toBe(2);
    });
  });
});
