import { resolveSlurm } from './resolveSlurm.ts';
import { resolveStandalone } from './resolveStandalone.ts';

// Exposes the WebView session params for a page. Capture + URL strip already
// happened at client boot (captureWebviewSession, from hooks.client), so on the
// client these read from sessionStorage while the URL is clean; on the server
// (no storage) they read the URL params still present during SSR. Both yield the
// same values, so the first client render matches SSR.
export function useWebviewSession() {
  return {
    slurm: resolveSlurm(),
    isStandalone: resolveStandalone(),
  };
}
