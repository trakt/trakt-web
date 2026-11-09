import { server } from '$mocks/server.ts';
import { WorkerMessage } from '$worker/WorkerMessage';
import { workerRequest } from '$worker/workerRequest';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bustStaleCache } from './bustStaleCache.ts';
import { DeploymentEndpoint } from './DeploymentEndpoint.ts';

vi.mock('$lib/utils/retry/retry.ts', () => ({
  retry: <T>(fn: () => Promise<T>) => fn(),
}));
vi.mock('$worker/workerRequest', () => ({ workerRequest: vi.fn() }));

const DEPLOYMENT_URL = `*${DeploymentEndpoint.Get}`;

describe('bustStaleCache', () => {
  beforeEach(() => {
    vi.mocked(workerRequest).mockClear();
  });

  it('should bust the cache when a newer version is deployed', async () => {
    server.use(http.get(DEPLOYMENT_URL, () => HttpResponse.text('new')));

    await bustStaleCache('old');

    expect(workerRequest).toHaveBeenCalledWith(WorkerMessage.CacheBust);
  });

  it('should leave the cache alone when the version matches', async () => {
    server.use(http.get(DEPLOYMENT_URL, () => HttpResponse.text('same')));

    await bustStaleCache('same');

    expect(workerRequest).not.toHaveBeenCalled();
  });

  it('should skip quietly when the version check fails', async () => {
    server.use(http.get(DEPLOYMENT_URL, () => HttpResponse.error()));

    await expect(bustStaleCache('old')).resolves.toBeUndefined();
    expect(workerRequest).not.toHaveBeenCalled();
  });
});
