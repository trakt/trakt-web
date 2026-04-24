import { reportDialogStore } from './_internal/reportDialogStore.ts';
import type { ReportParams } from './models/ReportParams.ts';

export function useReportDialog() {
  return {
    open: (params: ReportParams) => reportDialogStore.open(params),
    close: () => reportDialogStore.close(),
  };
}
