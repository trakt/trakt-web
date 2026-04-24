import * as m from '$lib/features/i18n/messages.ts';
import { ReportError } from '../models/ReportError.ts';

const errorMessage: Record<ReportError, () => string> = {
  [ReportError.AlreadyReported]: m.error_text_report_already_reported,
  [ReportError.RateLimited]: m.error_text_report_rate_limited,
  [ReportError.Unknown]: m.error_text_report_unknown,
};

export function toTranslatedReportError(error: ReportError): string {
  return errorMessage[error]();
}
