import type { UserCollection } from '$lib/features/auth/stores/useCurrentUserCollection.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { server } from '$mocks/server.ts';
import { strFromU8, unzipSync } from 'fflate';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadFile } from './downloadFile.ts';
import { runCustomLibraryExport } from './runCustomLibraryExport.ts';
import { runExportGate } from './runExportGate.ts';

vi.mock('./downloadFile.ts', () => ({ downloadFile: vi.fn() }));

const movie = {
  type: 'movie',
  movie: { title: 'A movie', ids: { trakt: 1 } },
  collected_at: '2020-01-01T00:00:00Z',
  metadata: { media_type: 'bluray' },
  available_on: [],
};
const episode = {
  type: 'episode',
  episode: { ids: { trakt: 2 }, season: 1, number: 1 },
  available_on: [],
};

async function exportLibrary(signal = new AbortController().signal) {
  const onCollection = vi.fn<(collection: UserCollection) => void>();
  const result = await runExportGate({
    user: { slug: 'collector', isVip: false },
    signal,
    onStatus: NOOP_FN,
    onProgress: NOOP_FN,
    exporter: (options) => runCustomLibraryExport({ ...options, onCollection }),
  });
  return { result, onCollection };
}

describe('runCustomLibraryExport', () => {
  beforeEach(() => {
    vi.mocked(downloadFile).mockReset();
  });

  it('should export every custom page with metadata before handing over IDs for removal', async () => {
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('available_on')).toBe('other');
        const page = url.searchParams.get('page');
        return HttpResponse.json(page === '1' ? [movie] : [episode], {
          headers: { 'X-Pagination-Page-Count': '2' },
        });
      }),
    );
    const { result, onCollection } = await exportLibrary();
    expect(result).toEqual({ outcome: 'proceed' });
    expect(onCollection).toHaveBeenCalledWith({
      movies: new Set([1]),
      episodes: new Set([2]),
    });
    expect(vi.mocked(downloadFile).mock.invocationCallOrder.at(0)).toBeLessThan(
      onCollection.mock.invocationCallOrder.at(0) ?? 0,
    );
    const [blob, filename] = vi.mocked(downloadFile).mock.calls.at(0) ?? [];
    expect(filename).toBe('trakt-custom-library-collector.zip');
    const files = unzipSync(new Uint8Array(await (blob as Blob).arrayBuffer()));
    expect(Object.keys(files)).toEqual([
      'custom-library-1.json',
      'custom-library-2.json',
    ]);
    expect(
      JSON.parse(strFromU8(files['custom-library-1.json'] ?? new Uint8Array())),
    ).toEqual([movie]);
  });

  it('should block clearing when any export page fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(NOOP_FN);
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        ({ request }) =>
          new URL(request.url).searchParams.get('page') === '1'
            ? HttpResponse.json([movie], {
              headers: { 'X-Pagination-Page-Count': '2' },
            })
            : HttpResponse.json({}, { status: 403 }),
      ),
    );
    const { result, onCollection } = await exportLibrary();
    expect(result.outcome).toBe('failed');
    expect(downloadFile).not.toHaveBeenCalled();
    expect(onCollection).not.toHaveBeenCalled();
  });

  it('should refuse a response containing Plex items', async () => {
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        () =>
          HttpResponse.json([{ ...movie, available_on: [{ name: 'plex' }] }]),
      ),
    );
    const { result, onCollection } = await exportLibrary();
    expect(result.outcome).toBe('failed');
    expect(downloadFile).not.toHaveBeenCalled();
    expect(onCollection).not.toHaveBeenCalled();
  });

  it('should block clearing when the download fails', async () => {
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        () => HttpResponse.json([movie]),
      ),
    );
    vi.mocked(downloadFile).mockImplementation(() => {
      throw new Error('Download failed');
    });
    const { result, onCollection } = await exportLibrary();
    expect(result.outcome).toBe('failed');
    expect(onCollection).not.toHaveBeenCalled();
  });

  it('should abandon an aborted export without handing over IDs', async () => {
    const controller = new AbortController();
    controller.abort();
    const { result, onCollection } = await exportLibrary(controller.signal);
    expect(result.outcome).toBe('aborted');
    expect(downloadFile).not.toHaveBeenCalled();
    expect(onCollection).not.toHaveBeenCalled();
  });
});
