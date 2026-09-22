import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';
import { strToU8, zip, type Zippable } from 'fflate';
import { z } from 'zod';
import { downloadFile } from './downloadFile.ts';
import type { ExportOptions } from './models/ExportOptions.ts';
import { processEndpoint } from './processEndpoint.ts';

const mediaSchema = z.object({
  ids: z.object({ trakt: z.number().int().positive() }),
});
const entriesSchema = z.array(
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('movie'), movie: mediaSchema }),
    z.object({ type: z.literal('episode'), episode: mediaSchema }),
  ]).and(z.object({
    available_on: z.array(z.object({ name: z.string() })).refine(
      (services) => services.every((service) => service.name !== 'plex'),
      'Plex items cannot be exported for custom library removal.',
    ),
  })),
);

type CustomLibraryExportOptions = ExportOptions & {
  onCollection: (collection: UserCollection) => void;
};

export async function runCustomLibraryExport({
  user,
  signal,
  onStatus,
  onProgress,
  onComplete,
  onError,
  onCollection,
}: CustomLibraryExportOptions): Promise<void> {
  const files: Zippable = {};
  const collection: UserCollection = { movies: new Set(), episodes: new Set() };

  try {
    signal?.throwIfAborted();
    onStatus({ type: 'fetch', item: 'custom-library' });
    await processEndpoint({
      path:
        'sync/collection/media?available_on=other&extended=metadata,gdpr,available_on',
      signal,
      onPage: (data, { page, pageCount }) => {
        const entries = entriesSchema.parse(data);
        entries.forEach((item) => {
          if (item.type === 'movie') {
            collection.movies.add(item.movie.ids.trakt);
          } else {
            collection.episodes.add(item.episode.ids.trakt);
          }
        });
        files[`custom-library-${page}.json`] = strToU8(JSON.stringify(data));
        onProgress({ processed: page, total: pageCount, page });
      },
    });

    signal?.throwIfAborted();
    onStatus({ type: 'zip' });
    const archive = await new Promise<Uint8Array>((resolve, reject) => {
      zip(files, (err, out) => err ? reject(err) : resolve(out));
    });
    signal?.throwIfAborted();
    downloadFile(
      new Blob([archive as BlobPart], { type: 'application/zip' }),
      `trakt-custom-library-${user.slug}.zip`,
    );
    onCollection(collection);
    onStatus({ type: 'complete' });
    onComplete();
  } catch (err) {
    if (!signal?.aborted) onError(err);
  }
}
