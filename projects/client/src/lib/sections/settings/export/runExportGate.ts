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
  let hasErrored = false;

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
    onComplete: () => {},
    onError: () => {
      hasErrored = true;
    },
  });

  if (signal.aborted) {
    return { outcome: 'aborted' };
  }

  if (hasErrored) {
    return { outcome: 'failed' };
  }

  if (failed === 0) {
    return { outcome: 'proceed' };
  }

  return { outcome: 'partial', failed, total };
}
