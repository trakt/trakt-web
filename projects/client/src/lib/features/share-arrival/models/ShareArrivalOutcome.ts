import type { ShareClickOutcome } from '$lib/requests/models/ShareClickOutcome.ts';

export type ShareArrivalOutcome =
  | ShareClickOutcome
  | 'anonymous'
  | 'uncredited'
  | 'failed';
