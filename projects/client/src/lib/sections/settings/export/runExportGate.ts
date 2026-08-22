import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ExportGateResult } from './models/ExportGateResult.ts';
import type { ExportProgress } from './models/ExportProgress.ts';
import type { ExportStatus } from './models/ExportStatus.ts';
import type { ExportUser } from './models/ExportUser.ts';
import { runRawExport } from './runRawExport.ts';

type RunExportGateOptions = {
  user: ExportUser;
  signal: AbortSignal;
  onStatus: (status: ExportStatus) => void;
  onProgress: (progress: ExportProgress) => void;
};

export async function runExportGate({
  user,
  signal,
  onStatus,
  onProgress,
}: RunExportGateOptions): Promise<ExportGateResult> {
  let total = 0;
  let failed = 0;
  let error: string | Nil = null;

  await runRawExport({
    user,
    signal,
    onStatus: (status) => {
      if (status.type === 'partial') {
        failed = status.failed;
      }

      onStatus(status);
    },
    onProgress: (progress) => {
      total = progress.total;
      onProgress(progress);
    },
    onComplete: NOOP_FN,
    onError: (err) => {
      error = err instanceof Error ? err.message : String(err);
    },
  });

  if (signal.aborted) {
    return { outcome: 'aborted' };
  }

  if (error) {
    return { outcome: 'failed', error };
  }

  if (failed === 0) {
    return { outcome: 'proceed' };
  }

  return { outcome: 'partial', failed, total };
}
