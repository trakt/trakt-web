import { WorkerMessage } from '$lib/utils/worker/WorkerMessage.ts';

export async function workerRequest(type: WorkerMessage) {
  if (!navigator.serviceWorker?.controller) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  if (!registration.active) {
    return;
  }

  registration.active.postMessage({
    type,
    timestamp: Date.now(),
  });
}
