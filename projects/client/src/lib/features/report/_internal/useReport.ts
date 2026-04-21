import { reportRequest } from '$lib/requests/queries/reports/reportRequest.ts';
import { BehaviorSubject } from 'rxjs';
import type { ReportParams } from '../models/ReportParams.ts';
import type { ReportReason } from '../models/ReportReason.ts';
import { ReportError } from '../models/ReportError.ts';
import { mapToReportError } from './mapToReportError.ts';

type ReportProps = {
  params: ReportParams;
  reason: ReportReason;
  message: string;
};

export function useReport() {
  const isSubmitting = new BehaviorSubject(false);
  const error = new BehaviorSubject<ReportError | null>(null);

  const submit = async (
    { params, reason, message }: ReportProps,
  ): Promise<boolean> => {
    isSubmitting.next(true);
    error.next(null);

    try {
      const result = await reportRequest({ params, reason, message });

      if (result.ok) {
        return true;
      }

      error.next(mapToReportError(result.status));
      return false;
    } catch {
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
