import type { OfflineActionEndpoint } from '$lib/features/offline/models/OfflineActionEndpoint.ts';

export type OnboardingMutationKey =
  | OfflineActionEndpoint
  | 'media:check-in'
  | 'user:follow';
