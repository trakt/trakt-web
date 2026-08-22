import type { ExportProgressState } from './ExportProgressState.ts';

export function createExportProgressState(): ExportProgressState {
  return {
    isExporting: false,
    processed: 0,
    total: 0,
    page: 0,
    status: null,
    hasFailed: false,
  };
}
