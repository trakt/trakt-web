import { chunk } from '$lib/utils/array/chunk.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { AnalyticsData } from '../AnalyticsData.ts';
import type { AnalyticsEngine } from './AnalyticsEngine.ts';
import { isKnownAnalyticsEvent } from './isKnownAnalyticsEvent.ts';
import { splitEventPayload } from './splitEventPayload.ts';

const HAL_ENDPOINT = 'https://hal.trakt.tv/e';

// HAL refuses a batch over 50 events outright, so chunk rather than trim.
const MAX_EVENTS_PER_BATCH = 50;
const FLUSH_DELAY = time.seconds(10);

type HalEvent = {
  event: string;
  at: number;
  dims: Record<string, string>;
  metrics: Record<string, number>;
};

// `text/plain` keeps the request CORS-simple, so it never preflights. It is also
// the only content type `sendBeacon` can produce without one.
function sendBatch(endpoint: string, events: ReadonlyArray<HalEvent>) {
  const body = new Blob(
    [JSON.stringify({ sentAt: Date.now(), events })],
    { type: 'text/plain;charset=UTF-8' },
  );

  if (navigator.sendBeacon?.(endpoint, body)) {
    return;
  }

  // Beacon declined to queue (its own ~64KB cap). `keepalive` is the only
  // fallback that outlives page teardown. No credentials: HAL answers
  // `Access-Control-Allow-Origin: *` and must never see a cookie.
  fetch(endpoint, { method: 'POST', body, keepalive: true }).catch(NOOP_FN);
}

type CreateHalEngineProps = {
  endpoint?: string;
  send?: (endpoint: string, events: ReadonlyArray<HalEvent>) => void;
  // Dims merged into every event, whoever recorded it.
  enrich?: () => AnalyticsData;
};

export function createHalEngine(
  {
    endpoint = `${HAL_ENDPOINT}?trakt-api-key=${TRAKT_CLIENT_ID}`,
    send = sendBatch,
    enrich = () => ({}),
  }: CreateHalEngineProps = {},
): AnalyticsEngine {
  let buffered: ReadonlyArray<HalEvent> = [];
  let flushTimer: ReturnType<typeof setTimeout> | Nil = null;

  const flush = () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    if (buffered.length === 0) {
      return;
    }

    const pending = buffered;
    buffered = [];

    chunk(pending, MAX_EVENTS_PER_BATCH).forEach((batch) =>
      send(endpoint, batch)
    );
  };

  const scheduleFlush = () => {
    if (flushTimer) {
      return;
    }

    flushTimer = setTimeout(flush, FLUSH_DELAY);
  };

  // `pagehide` and a hidden `visibilitychange` are the only teardown signals
  // mobile Safari fires reliably; `beforeunload`/`unload` are not.
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    });
  }

  return {
    record: (key: string, data: AnalyticsData) => {
      if (!isKnownAnalyticsEvent(key)) {
        return;
      }

      // Enriched dims last so an event payload cannot shadow them.
      buffered = [
        ...buffered,
        {
          event: key,
          at: Date.now(),
          ...splitEventPayload({ ...data, ...enrich() }),
        },
      ];

      if (buffered.length >= MAX_EVENTS_PER_BATCH) {
        flush();
        return;
      }

      scheduleFlush();
    },
  };
}
