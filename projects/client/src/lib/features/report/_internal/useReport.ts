import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { reportRequest } from '$lib/requests/queries/reports/reportRequest.ts';
import { BehaviorSubject } from 'rxjs';
import type { ReportParams } from '../models/ReportParams.ts';
import type { ReportReason } from '../models/ReportReason.ts';
import { ReportError } from '../models/ReportError.ts';
import { mapToReportError } from './mapToReportError.ts';
import { toReportTracking } from './toReportTracking.ts';

type ReportProps = {
  params: ReportParams;
  reason: ReportReason;
  message: string;
};

export function useReport() {
  const { track } = useTrack(AnalyticsEvent.Report);
  const isSubmitting = new BehaviorSubject(false);
  const error = new BehaviorSubject<ReportError | null>(null);

  const submit = async ({
    params,
    reason,
    message,
  }: ReportProps): Promise<boolean> => {
    isSubmitting.next(true);
    error.next(null);

    try {
      const result = await reportRequest({ params, reason, message });

      if (result.ok) {
        track(toReportTracking({ params, reason, outcome: 'sent' }));
        return true;
      }

      const reportError = mapToReportError(result.status);
      track(toReportTracking({ params, reason, outcome: reportError }));
      error.next(reportError);
      return false;
    } catch {
      track(toReportTracking({ params, reason, outcome: ReportError.Unknown }));
      error.next(ReportError.Unknown);
      return false;
    } finally {
      isSubmitting.next(false);
    }
  };

  return {
    submit,
    isSubmitting: isSubmitting.asObservable(),
    error: error.asObservable(),
    dismissError: () => error.next(null),
  };
}
