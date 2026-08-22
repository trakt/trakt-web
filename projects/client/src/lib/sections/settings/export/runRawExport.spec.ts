import { server } from '$mocks/server.ts';
import { unzipSync } from 'fflate';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadFile } from './downloadFile.ts';
import { runRawExport } from './runRawExport.ts';

vi.mock('./downloadFile.ts', () => ({ downloadFile: vi.fn() }));

const SLUG = 'mega-collector';
const FAILING_ENDPOINT = `http://localhost/users/${SLUG}/collection/shows`;

async function exportFor(user = { slug: SLUG, isVip: false }) {
  const statuses: Array<{ type: string; failed?: number }> = [];
  const failures: Array<unknown> = [];

  await runRawExport({
    user,
    onStatus: (status) => statuses.push(status),
    onProgress: () => {},
    onComplete: () => {},
    onError: (err) => failures.push(err),
  });

  const failure = failures.at(0);
  if (failure) {
    throw failure;
  }

  const [blob] = vi.mocked(downloadFile).mock.calls.at(-1) ?? [];
  const bytes = new Uint8Array(await (blob as Blob).arrayBuffer());

  return { statuses, files: unzipSync(bytes) };
}

describe('runRawExport', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(downloadFile).mockClear();

    server.use(
      http.get(FAILING_ENDPOINT, () => HttpResponse.json({}, { status: 404 })),
      http.get('http://localhost/*', () => HttpResponse.json([])),
    );
  });

  it('should keep exporting the remaining endpoints when one fails', async () => {
    const { files } = await exportFor();

    expect(files['collection-shows.json']).to.equal(undefined);
    expect(files['collection-movies.json']).to.not.equal(undefined);
    expect(files['user-profile.json']).to.not.equal(undefined);
  });

  it('should report a partial export instead of a plain success', async () => {
    const { statuses } = await exportFor();

    expect(statuses.at(-1)).to.deep.equal({ type: 'partial', failed: 1 });
  });

  it('should describe every failure in _errors.json', async () => {
    const { files } = await exportFor();

    const errors = JSON.parse(
      new TextDecoder().decode(files['_errors.json']),
    );

    expect(errors).to.deep.equal([
      {
        endpoint: `users/${SLUG}/collection/shows?extended=metadata,gdpr`,
        error: 'HTTP 404',
        fetchedPages: 0,
        totalPages: 0,
      },
    ]);
  });

  it('should report a plain success when nothing fails', async () => {
    server.use(http.get('http://localhost/*', () => HttpResponse.json([])));

    const { statuses, files } = await exportFor();

    expect(statuses.at(-1)).to.deep.equal({ type: 'complete' });
    expect(files['_errors.json']).to.equal(undefined);
  });

  it('should resolve only once the archive has been downloaded', async () => {
    await runRawExport({
      user: { slug: SLUG, isVip: false },
      onStatus: () => {},
      onProgress: () => {},
      onComplete: () => {},
      onError: () => {},
    });

    expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce();
  });

  it('should abandon an aborted export silently', async () => {
    const controller = new AbortController();
    const statuses: Array<{ type: string }> = [];
    const failures: Array<unknown> = [];

    server.use(
      http.get('http://localhost/*', () => {
        controller.abort();
        return HttpResponse.json([]);
      }),
    );

    await runRawExport({
      user: { slug: SLUG, isVip: false },
      signal: controller.signal,
      onStatus: (status) => statuses.push(status),
      onProgress: () => {},
      onComplete: () => {},
      onError: (err) => failures.push(err),
    });

    expect(failures).to.have.length(0);
    expect(vi.mocked(downloadFile)).not.toHaveBeenCalled();
    expect(statuses.some((status) => status.type === 'zip')).to.equal(false);
  });
});
