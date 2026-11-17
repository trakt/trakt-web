import * as m from '$lib/features/i18n/messages.ts';
import { ReportReason } from '../models/ReportReason.ts';

const reasonLabelMap: Record<ReportReason, () => string> = {
  [ReportReason.Spoilers]: m.label_report_reason_spoilers,
  [ReportReason.Language]: m.label_report_reason_language,
  [ReportReason.Abusive]: m.label_report_reason_abusive,
  [ReportReason.Spam]: m.label_report_reason_spam,
  [ReportReason.Bigotry]: m.label_report_reason_bigotry,
  [ReportReason.Political]: m.label_report_reason_political,
  [ReportReason.OffTopic]: m.label_report_reason_offtopic,
  [ReportReason.Duplicate]: m.label_report_reason_duplicate,
  [ReportReason.Adult]: m.label_report_reason_adult,
  [ReportReason.Other]: m.label_report_reason_other,
};

export function reasonLabel(reason: ReportReason): string {
  return reasonLabelMap[reason]();
}
