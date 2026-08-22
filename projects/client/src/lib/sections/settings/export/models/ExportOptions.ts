import type { ExportProgress } from './ExportProgress.ts';
import type { ExportStatus } from './ExportStatus.ts';
import type { ExportUser } from './ExportUser.ts';

export type ExportOptions = {
  user: ExportUser;
  signal?: AbortSignal;
  onStatus: (status: ExportStatus) => void;
  onProgress: (progress: ExportProgress) => void;
  onComplete: () => void;
  onError: (err: unknown) => void;
};
