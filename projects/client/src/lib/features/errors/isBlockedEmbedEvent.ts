import type { ErrorEvent as SentryErrorEvent } from '@sentry/sveltekit';

const YOUTUBE_EMBED_BLOCKED_CODES: ReadonlySet<number> = new Set([101, 150]);

type SerializedPlayerError = {
  detail?: {
    code?: unknown;
    plyr?: unknown;
  };
};

function toSerializedPlayerError(
  event: SentryErrorEvent,
): SerializedPlayerError | null {
  const serialized = event.extra?.__serialized__;
  if (typeof serialized !== 'object' || serialized === null) return null;

  return serialized as SerializedPlayerError;
}

export function isBlockedEmbedEvent(event: SentryErrorEvent): boolean {
  const detail = toSerializedPlayerError(event)?.detail;
  if (!detail?.plyr) return false;

  return (
    typeof detail.code === 'number' &&
    YOUTUBE_EMBED_BLOCKED_CODES.has(detail.code)
  );
}
