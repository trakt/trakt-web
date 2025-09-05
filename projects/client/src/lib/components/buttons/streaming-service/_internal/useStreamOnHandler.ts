import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { getWebOSHandler } from '$lib/features/web-os/getWebOSHandler.ts';
import type { StreamNow } from '$lib/requests/models/StreamingServiceOptions.ts';
import { useStreamingServices } from '$lib/stores/useStreamingServices.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, get } from 'svelte/store';

type StreamOnHandler = {
  href: HttpsUrl;
  onclick: () => void;
} | {
  onclick: () => void;
};

export function useStreamOnHandler(service: StreamNow): StreamOnHandler {
  const { track } = useTrack(AnalyticsEvent.StreamOn);

  const trackSource = () => track({ source: service.source });

  const webOSHandler = getWebOSHandler();
  if (!webOSHandler || !service.webOSLink) {
    return {
      href: service.link,
      onclick: trackSource,
    };
  }

  const { sources } = useStreamingServices();
  const source = derived(
    sources,
    ($sources) => $sources.find((s) => s.source === service.source),
  );

  const handler = () => {
    trackSource();

    const sourceName = get(source)?.name ?? service.source;
    webOSHandler.launch(
      sourceName,
      assertDefined(service.webOSLink, 'The webOS link is required'),
    );
  };

  return {
    onclick: handler,
  };
}
