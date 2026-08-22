import type { ExportStatus } from '../../export/models/ExportStatus.ts';

export type ExportProgressState = {
  isExporting: boolean;
  processed: number;
  total: number;
  page: number;
  status: ExportStatus | Nil;
  hasFailed: boolean;
};
