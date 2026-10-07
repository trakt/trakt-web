import type { VipCancelOutcome } from '../models/VipCancelOutcome.ts';
import type { VipCancelSummary } from '../models/VipCancelSummary.ts';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';

export type OutcomeCardProps = {
  outcome: VipCancelOutcome;
  summary: VipCancelSummary;
  offer: VipRetentionOffer | Nil;
};
