import { chunk } from '$lib/utils/array/chunk.ts';

const DELETE_CHUNK_SIZE = 50;

type ListedObject = {
  key: string;
  lastModified: number;
};

type VersionedBucket = {
  list: (opts: { cursor?: string; prefix: string }) => Promise<{
    objects: ReadonlyArray<ListedObject>;
    truncated: boolean;
    cursor?: string;
  }>;
  delete: (key: string) => Promise<void>;
};

type VersionedTarget = {
  root: string;
  current: string;
  isLatestOnly?: boolean;
};

type PruneVersionedShareImagesProps = {
  bucket: VersionedBucket;
  targets: ReadonlyArray<VersionedTarget>;
  isDryRun?: boolean;
};

type PruneResult = {
  deleted: number;
  kept: number;
  errors: number;
};

const toFolder = (key: string) => key.slice(0, key.lastIndexOf('/'));

function groupByFolder(
  objects: ReadonlyArray<ListedObject>,
): ReadonlyMap<string, ReadonlyArray<ListedObject>> {
  return objects.reduce((folders, object) => {
    const folder = toFolder(object.key);
    folders.set(folder, [...(folders.get(folder) ?? []), object]);
    return folders;
  }, new Map<string, ListedObject[]>());
}

function toOlderKeys(folder: ReadonlyArray<ListedObject>) {
  if (folder.some((object) => Number.isNaN(object.lastModified))) {
    return [];
  }

  const newest = folder.reduce((latest, object) =>
    object.lastModified > latest.lastModified ? object : latest,
  );

  return folder.filter((object) => object !== newest).map(({ key }) => key);
}

function toStaleKeys(
  objects: ReadonlyArray<ListedObject>,
  target: VersionedTarget,
): ReadonlyArray<string> {
  const isCurrent = (object: ListedObject) =>
    object.key.startsWith(target.current);
  const outdated = objects.filter((object) => !isCurrent(object));
  const superseded = target.isLatestOnly
    ? [...groupByFolder(objects.filter(isCurrent)).values()].flatMap(
        toOlderKeys,
      )
    : [];

  return [...outdated.map(({ key }) => key), ...superseded];
}

async function listAll(
  bucket: VersionedBucket,
  prefix: string,
): Promise<ReadonlyArray<ListedObject>> {
  const page = await bucket.list({ prefix });
  const pages = [page.objects];
  let cursor = page.truncated ? page.cursor : undefined;

  while (cursor) {
    const next = await bucket.list({ cursor, prefix });
    pages.push(next.objects);
    cursor = next.truncated ? next.cursor : undefined;
  }

  return pages.flat();
}

async function deleteAll(
  bucket: VersionedBucket,
  keys: ReadonlyArray<string>,
): Promise<{ deleted: number; errors: number }> {
  const counts = { deleted: 0, errors: 0 };

  for (const keysChunk of chunk(keys, DELETE_CHUNK_SIZE)) {
    const settled = await Promise.allSettled(
      keysChunk.map((key) => bucket.delete(key)),
    );
    counts.deleted += settled.filter((r) => r.status === 'fulfilled').length;
    counts.errors += settled.filter((r) => r.status === 'rejected').length;
  }

  return counts;
}

export async function pruneVersionedShareImages({
  bucket,
  targets,
  isDryRun = false,
}: PruneVersionedShareImagesProps): Promise<PruneResult> {
  const result: PruneResult = { deleted: 0, kept: 0, errors: 0 };

  for (const target of targets) {
    const objects = await listAll(bucket, target.root);
    const stale = toStaleKeys(objects, target).filter((key) =>
      key.startsWith(target.root),
    );
    result.kept += objects.length - stale.length;

    if (isDryRun) {
      stale.forEach((key) => console.log(`[dry-run] would delete ${key}`));
      continue;
    }

    const { deleted, errors } = await deleteAll(bucket, stale);
    result.deleted += deleted;
    result.errors += errors;
  }

  return result;
}
