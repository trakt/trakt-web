import { writable } from '$lib/utils/store/WritableSubject.ts';

export type StreamingConnectionStatusKind = 'connected' | 'error' | 'cancelled';

export type StreamingConnectionStatus = {
  kind: StreamingConnectionStatusKind;
  serviceId?: string | null;
};

/**
 * Transient status of the most recent connect attempt, surfaced as an inline
 * banner on the streaming sync settings page. Set by the connect action (mint
 * failure) and by the streaming connect callback route (`yc_status`), cleared
 * on dismiss.
 */
export const streamingConnectionStatus = writable<
  StreamingConnectionStatus | null
>(null);
