import { describe, expect, it, vi } from 'vitest';
import { pruneVersionedShareImages } from './prune-versioned-share-images.ts';

type ListedObject = { key: string; lastModified: number };

function makeBucket(objects: ReadonlyArray<ListedObject>) {
  const deleted: string[] = [];

  return {
    list: vi.fn(({ prefix }: { prefix: string }) =>
      Promise.resolve({
        objects: objects.filter((object) => object.key.startsWith(prefix)),
        truncated: false,
      }),
    ),
    delete: vi.fn((key: string) => {
      deleted.push(key);
      return Promise.resolve();
    }),
    deleted,
  };
}

const mir = {
  root: 'images/share/mir/',
  current: 'images/share/mir/v2/',
};

const profile = {
  root: 'images/share/profile/',
  current: 'images/share/profile/v1/',
  isLatestOnly: true,
};

describe('pruneVersionedShareImages', () => {
  it('should delete images from older and unversioned designs', async () => {
    const bucket = makeBucket([
      { key: 'images/share/mir/feed/sean/2026-10.jpg', lastModified: 1 },
      { key: 'images/share/mir/v1/feed/sean/2026-10.jpg', lastModified: 2 },
      { key: 'images/share/mir/v2/feed/sean/2026-10.jpg', lastModified: 3 },
    ]);

    const result = await pruneVersionedShareImages({ bucket, targets: [mir] });

    expect(bucket.deleted).toEqual([
      'images/share/mir/feed/sean/2026-10.jpg',
      'images/share/mir/v1/feed/sean/2026-10.jpg',
    ]);
    expect(result).toEqual({ deleted: 2, kept: 1, errors: 0 });
  });

  it('should keep every month of the current design', async () => {
    const bucket = makeBucket([
      { key: 'images/share/mir/v2/feed/sean/2026-09.jpg', lastModified: 1 },
      { key: 'images/share/mir/v2/feed/sean/2026-10.jpg', lastModified: 2 },
    ]);

    await pruneVersionedShareImages({ bucket, targets: [mir] });

    expect(bucket.deleted).toEqual([]);
  });

  it('should keep only the newest profile image per user', async () => {
    const bucket = makeBucket([
      { key: 'images/share/profile/v1/og/sean/aaa.jpg', lastModified: 1 },
      { key: 'images/share/profile/v1/og/sean/bbb.jpg', lastModified: 3 },
      { key: 'images/share/profile/v1/og/justin/ccc.jpg', lastModified: 2 },
    ]);

    await pruneVersionedShareImages({ bucket, targets: [profile] });

    expect(bucket.deleted).toEqual(['images/share/profile/v1/og/sean/aaa.jpg']);
  });

  it('should count failed deletes as errors', async () => {
    const bucket = makeBucket([
      { key: 'images/share/mir/v1/feed/sean/2026-10.jpg', lastModified: 1 },
    ]);
    bucket.delete.mockRejectedValueOnce(new Error('nope'));

    const result = await pruneVersionedShareImages({ bucket, targets: [mir] });

    expect(result).toEqual({ deleted: 0, kept: 0, errors: 1 });
  });

  it('should keep a folder whole when a date cannot be read', async () => {
    const bucket = makeBucket([
      { key: 'images/share/profile/v1/og/sean/aaa.jpg', lastModified: NaN },
      { key: 'images/share/profile/v1/og/sean/bbb.jpg', lastModified: 3 },
    ]);

    await pruneVersionedShareImages({ bucket, targets: [profile] });

    expect(bucket.deleted).toEqual([]);
  });

  it('should only delete keys under the target root', async () => {
    const bucket = makeBucket([{ key: '', lastModified: 1 }]);
    bucket.list.mockResolvedValueOnce({
      objects: [{ key: '', lastModified: 1 }],
      truncated: false,
    });

    await pruneVersionedShareImages({ bucket, targets: [mir] });

    expect(bucket.deleted).toEqual([]);
  });

  it('should not delete anything on a dry run', async () => {
    const bucket = makeBucket([
      { key: 'images/share/mir/v1/feed/sean/2026-10.jpg', lastModified: 1 },
    ]);

    const result = await pruneVersionedShareImages({
      bucket,
      targets: [mir],
      isDryRun: true,
    });

    expect(bucket.deleted).toEqual([]);
    expect(result.deleted).toBe(0);
  });
});
