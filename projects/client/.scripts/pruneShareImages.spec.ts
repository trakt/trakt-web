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
      const filtered = opts?.prefix
        ? objects.filter((o) => o.key.startsWith(opts.prefix!))
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
  return String(NOW - msBefore);
}

function releaseDate(daysAgo: number): string {
  return String(NOW - daysAgo * 24 * 60 * 60 * 1000);
}

const prefixes = ['images/og/movie/', 'images/og/show/'];

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
          key: 'images/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(13 * 60 * 60 * 1000), // 13h ago
            releaseDate: releaseDate(7),
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
          key: 'images/og/movie/the-dark-knight/image.png',
          customMetadata: {
            cachedAt: cachedAt(11 * 60 * 60 * 1000), // 11h ago
            releaseDate: releaseDate(7),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('prunes a mid-age release cached over 3 days ago (tier 2: 15–40 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/movie/oppenheimer/image.png',
          customMetadata: {
            cachedAt: cachedAt(4 * 24 * 60 * 60 * 1000), // 4d ago
            releaseDate: releaseDate(20),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('skips a mid-age release cached under 3 days ago (tier 2: 15–40 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/movie/oppenheimer/image.png',
          customMetadata: {
            cachedAt: cachedAt(2 * 24 * 60 * 60 * 1000), // 2d ago
            releaseDate: releaseDate(20),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.skipped).toBe(1);
    });

    it('prunes older release cached over 7 days ago (tier 3: 41–120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/show/breaking-bad/image.png',
          customMetadata: {
            cachedAt: cachedAt(8 * 24 * 60 * 60 * 1000), // 8d ago
            releaseDate: releaseDate(60),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('prunes catalog content cached over 30 days ago (fallback: >120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/show/the-wire/image.png',
          customMetadata: {
            cachedAt: cachedAt(31 * 24 * 60 * 60 * 1000), // 31d ago
            releaseDate: releaseDate(365 * 10),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
    });

    it('skips catalog content cached under 30 days ago (fallback: >120 days)', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/show/the-wire/image.png',
          customMetadata: {
            cachedAt: cachedAt(20 * 24 * 60 * 60 * 1000), // 20d ago
            releaseDate: releaseDate(365 * 10),
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.skipped).toBe(1);
    });
  });

  describe('legacy entries (missing releaseDate)', () => {
    it('always prunes entries missing releaseDate metadata', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/movie/legacy-film/image.png',
          customMetadata: {
            cachedAt: cachedAt(60 * 60 * 1000), // 1h ago — would be skipped if it had releaseDate
          },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(1);
      expect(result.skipped).toBe(0);
    });
  });

  describe('missing cachedAt', () => {
    it('skips entries with no cachedAt metadata', async () => {
      const bucket = makeBucket([
        {
          key: 'images/og/movie/unknown/image.png',
          customMetadata: { releaseDate: releaseDate(10) },
        },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('skips entries with no metadata at all', async () => {
      const bucket = makeBucket([
        { key: 'images/og/movie/no-meta/image.png' },
      ]);

      const result = await pruneShareImages(bucket, prefixes);

      expect(result.deleted).toBe(0);
      expect(result.skipped).toBe(1);
    });
  });

  describe('prefix scoping', () => {
    it('only lists objects under the given prefixes', async () => {
      const bucket = makeBucket([]);

      await pruneShareImages(bucket, ['images/og/movie/', 'images/feed/show/']);

      expect(bucket.list).toHaveBeenCalledTimes(2);
      expect(bucket.list).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: 'images/og/movie/' }),
      );
      expect(bucket.list).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: 'images/feed/show/' }),
      );
    });

    it('does not delete objects outside the given prefixes', async () => {
      const bucket = makeBucket([
        {
          key: 'immutable/some-asset.js',
          customMetadata: {
            cachedAt: cachedAt(365 * 24 * 60 * 60 * 1000),
            releaseDate: releaseDate(365),
          },
        },
      ]);

      await pruneShareImages(bucket, ['images/og/movie/']);

      expect(bucket.deleted).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('counts delete errors and continues processing remaining objects', async () => {
      const objects: BucketObject[] = [
        {
          key: 'images/og/movie/film-a/image.png',
          customMetadata: {
            cachedAt: cachedAt(31 * 24 * 60 * 60 * 1000),
            releaseDate: releaseDate(200),
          },
        },
        {
          key: 'images/og/movie/film-b/image.png',
          customMetadata: {
            cachedAt: cachedAt(31 * 24 * 60 * 60 * 1000),
            releaseDate: releaseDate(200),
          },
        },
      ];

      const bucket = makeBucket(objects);
      bucket.delete.mockRejectedValueOnce(new Error('R2 error'));

      const result = await pruneShareImages(bucket, ['images/og/movie/']);

      expect(result.errors).toBe(1);
      expect(result.deleted).toBe(1);
    });
  });

  describe('pagination', () => {
    it('follows cursor until truncated is false', async () => {
      const page1: BucketObject[] = [
        {
          key: 'images/og/movie/film-a/image.png',
          customMetadata: {
            cachedAt: cachedAt(31 * 24 * 60 * 60 * 1000),
            releaseDate: releaseDate(200),
          },
        },
      ];
      const page2: BucketObject[] = [
        {
          key: 'images/og/movie/film-b/image.png',
          customMetadata: {
            cachedAt: cachedAt(31 * 24 * 60 * 60 * 1000),
            releaseDate: releaseDate(200),
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

      const result = await pruneShareImages(bucket, ['images/og/movie/']);

      expect(listMock).toHaveBeenCalledTimes(2);
      expect(listMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ cursor: 'token-1' }),
      );
      expect(result.deleted).toBe(2);
    });
  });
});
