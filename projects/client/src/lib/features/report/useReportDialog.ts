import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { reportDialogStore } from './_internal/reportDialogStore.ts';
import type { ReportParams } from './models/ReportParams.ts';

export function useReportDialog() {
  const { track } = useTrack(AnalyticsEvent.ReportOpen);

  return {
    open: (params: ReportParams) => {
      track({ type: params.type });
      reportDialogStore.open(params);
    },
    close: () => reportDialogStore.close(),
  };
}
