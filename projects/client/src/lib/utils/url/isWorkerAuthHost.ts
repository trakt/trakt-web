const WORKER_AUTH_HOST_SUFFIX = '.workers.dev';

export function isWorkerAuthHost(hostname: string | Nil): boolean {
  return hostname?.endsWith(WORKER_AUTH_HOST_SUFFIX) ?? false;
}
