export type ManageSubscriptionResult =
  | { kind: 'redirect'; url: string }
  | { kind: 'missing-subscription' }
  | { kind: 'unavailable' };
