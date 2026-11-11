import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { toIssueReportError } from './_internal/toIssueReportError.ts';
import { toIssueReportFormData } from './_internal/toIssueReportFormData.ts';
import { toIssueReportTracking } from './_internal/toIssueReportTracking.ts';
import type { IssueReport } from './models/IssueReport.ts';
import { IssueReportError } from './models/IssueReportError.ts';

const ENDPOINT = '/api/report';

export function useIssueReport() {
  const { user } = useUser();
  const { track } = useTrack(AnalyticsEvent.IssueReportSent);
  const isSubmitting = new BehaviorSubject(false);
  const error = new BehaviorSubject<IssueReportError | null>(null);

  const submit = async (report: IssueReport): Promise<boolean> => {
    isSubmitting.next(true);
    error.next(null);

    try {
      const { id, username } = await firstValueFrom(user);
      const body = toIssueReportFormData(report, {
        userId: String(id),
        username,
      });

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
