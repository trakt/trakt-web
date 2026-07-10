import { time } from '$lib/utils/timing/time.ts';

// Scoped-key lifecycle, shared by the server-side mint and the client refresh.
// The client must re-mint before the server token expires, so refreshInterval
// stays safely below ttl. retryCooldown throttles re-minting after a failed
// refresh so a broken endpoint is not hammered on every keystroke.
export const SEARCH_KEY_LIFETIME = {
  ttl: time.minutes(15),
  refreshInterval: time.minutes(12),
  retryCooldown: time.minutes(1),
} as const;
