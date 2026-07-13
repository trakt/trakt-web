import { readWebviewParam } from './readWebviewParam.ts';

// Resolves the WebView VIP token for a YIR/MIR data request. The single source
// of truth for reading it; see readWebviewParam for the storage/URL precedence.
export function resolveSlurm(): string | undefined {
  return readWebviewParam('slurm');
}
