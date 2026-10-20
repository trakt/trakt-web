import type { ReportError } from '../models/ReportError.ts';
import type { ReportParams } from '../models/ReportParams.ts';
import { ReportReason } from '../models/ReportReason.ts';
import { reasonsFor } from './reasonsFor.ts';

type ReportTrackingProps = {
  params: ReportParams;
  reason: ReportReason;
  outcome: 'sent' | ReportError;
};

export function toReportTracking({
  params,
  reason,
  outcome,
}: ReportTrackingProps) {
  const isKnownReason = reasonsFor(params.type).includes(reason);

  return {
    type: params.type,
    reason: isKnownReason ? reason : ReportReason.Other,
    outcome,
  };
}
