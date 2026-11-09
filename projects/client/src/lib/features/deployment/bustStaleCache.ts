import { retry } from '$lib/utils/retry/retry.ts';
import { WorkerMessage } from '$worker/WorkerMessage';
import { workerRequest } from '$worker/workerRequest';
import { DeploymentEndpoint } from './DeploymentEndpoint.ts';

export async function bustStaleCache(activeSha: string): Promise<void> {
  const deployedSha = await retry(() => fetch(DeploymentEndpoint.Get))
    .then((res) => res.text())
    .catch(() => null);

  if (!deployedSha) return;
  if (activeSha === deployedSha) return;

  await workerRequest(WorkerMessage.CacheBust);
}
