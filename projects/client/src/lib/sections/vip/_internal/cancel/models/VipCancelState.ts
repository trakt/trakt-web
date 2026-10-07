import type { VipCancelSummary } from './VipCancelSummary.ts';

export type VipCancelState =
  | { kind: 'loading' }
  | { kind: 'ineligible' }
  | { kind: 'ready'; summary: VipCancelSummary };
