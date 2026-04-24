import * as m from '$lib/features/i18n/messages.ts';
import { ReportReason } from '../models/ReportReason.ts';

const REASON_LABEL: Record<ReportReason, () => string> = {
  [ReportReason.Spoilers]: m.label_report_reason_spoilers,
  [ReportReason.Language]: m.label_report_reason_language,
  [ReportReason.Abusive]: m.label_report_reason_abusive,
  [ReportReason.Spam]: m.label_report_reason_spam,
  [ReportReason.Bigotry]: m.label_report_reason_bigotry,
  [ReportReason.Political]: m.label_report_reason_political,
  [ReportReason.OffTopic]: m.label_report_reason_offtopic,
  [ReportReason.Support]: m.label_report_reason_support,
  [ReportReason.Duplicate]: m.label_report_reason_duplicate,
  [ReportReason.TooShort]: m.label_report_reason_too_short,
  [ReportReason.Remove]: m.label_report_reason_remove,
  [ReportReason.DataRefresh]: m.label_report_reason_data_refresh,
  [ReportReason.Metadata]: m.label_report_reason_metadata,
  [ReportReason.Adult]: m.label_report_reason_adult,
  [ReportReason.Runtime]: m.label_report_reason_runtime,
  [ReportReason.Tmdb]: m.label_report_reason_tmdb,
  [ReportReason.Other]: m.label_report_reason_other,
};

export function reasonLabel(reason: ReportReason): string {
  return REASON_LABEL[reason]();
}
