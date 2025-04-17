import { getDeepLinkHandler } from '$lib/features/deep-link/getDeepLinkHandler.ts';
import type { StreamNow } from '$lib/requests/models/StreamingServiceOptions.ts';
import { useStreamingServices } from '$lib/stores/useStreamingServices.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, get } from 'svelte/store';

type StreamOnHandler = {
  href: HttpsUrl;
} | {
  onclick: () => void;
};

export function useStreamOnHandler(service: StreamNow): StreamOnHandler {
  const deepLinkHandler = getDeepLinkHandler();
  if (!deepLinkHandler || !service.deepLink) {
    return {
      href: service.link,
    };
  }

  const { sources } = useStreamingServices();
  const source = derived(
    sources,
    ($sources) => $sources.find((s) => s.source === service.source),
  );

  const handler = () => {
    const sourceName = get(source)?.name ?? service.source;

    deepLinkHandler.open(
      sourceName,
      assertDefined(service.deepLink, 'Deep link is required'),
    );
  };

  return {
    onclick: handler,
  };
}
