const WORKER_AUTH_HOST_SUFFIX = '.workers.dev';

// The worker-auth beta is served from the worker's workers.dev host. When the
// app runs there, OAuth points at the worker (auth.trakt.tv) and redirects stay
// on the same origin, rather than the prod Doorkeeper-derived host.
export function isWorkerAuthHost(hostname: string | Nil): boolean {
  return hostname?.endsWith(WORKER_AUTH_HOST_SUFFIX) ?? false;
}
