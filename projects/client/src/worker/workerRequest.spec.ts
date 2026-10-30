import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkerMessage } from './WorkerMessage.ts';
import { workerRequest } from './workerRequest.ts';

function stubServiceWorker(ready: Promise<unknown>) {
  Object.defineProperty(globalThis.navigator, 'serviceWorker', {
    configurable: true,
    value: { controller: {}, ready },
  });
}

describe('workerRequest', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis.navigator, 'serviceWorker');
  });

  it('should post the message to the active worker', async () => {
    const postMessage = vi.fn();
    stubServiceWorker(Promise.resolve({ active: { postMessage } }));

    await workerRequest(WorkerMessage.CacheBust);

    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: WorkerMessage.CacheBust }),
    );
  });

  it('should resolve when the registration lookup fails', async () => {
    stubServiceWorker(
      Promise.reject(
        new DOMException(
          'Failed to get a ServiceWorkerRegistration: The document is in an invalid state.',
          'InvalidStateError',
        ),
      ),
    );

    await expect(
      workerRequest(WorkerMessage.CacheBust),
    ).resolves.toBeUndefined();
  });
});
