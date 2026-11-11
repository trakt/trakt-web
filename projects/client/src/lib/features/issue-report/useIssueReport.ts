import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { BehaviorSubject } from 'rxjs';
import { toIssueReportError } from './_internal/toIssueReportError.ts';
import { toIssueReportFormData } from './_internal/toIssueReportFormData.ts';
import { toIssueReportTracking } from './_internal/toIssueReportTracking.ts';
import type { IssueReport } from './models/IssueReport.ts';
import { IssueReportError } from './models/IssueReportError.ts';

const ENDPOINT = '/api/report';

export function useIssueReport() {
  const { track } = useTrack(AnalyticsEvent.IssueReportSent);
  const isSubmitting = new BehaviorSubject(false);
  const error = new BehaviorSubject<IssueReportError | null>(null);

  const submit = async (report: IssueReport): Promise<boolean> => {
    isSubmitting.next(true);
    error.next(null);

    try {
      const body = toIssueReportFormData(report);

      const response = await fetch(ENDPOINT, { method: 'POST', body });

      if (response.ok) {
        track(toIssueReportTracking(report));
        return true;
      }

      const reason = await response
        .json()
        .then((payload: { reason?: string } | null) => payload?.reason)
        .catch(() => null);
      error.next(toIssueReportError(reason));
      return false;
    } catch {
      error.next(IssueReportError.Unknown);
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
