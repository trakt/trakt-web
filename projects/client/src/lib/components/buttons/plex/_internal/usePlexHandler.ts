import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { getWebOSHandler } from '$lib/features/web-os/getWebOSHandler.ts';

const PLEX_SOURCE_NAME = 'plex';

type PlexHandler = {
  href: HttpsUrl;
  onclick: () => void;
} | {
  onclick: () => void;
};

export function usePlexHandler(link: HttpsUrl): PlexHandler {
  const { track } = useTrack(AnalyticsEvent.StreamOn);

  const trackPlex = () => track({ source: PLEX_SOURCE_NAME });

  const webOSHandler = getWebOSHandler();
  if (!webOSHandler) {
    return {
      href: link,
      onclick: trackPlex,
    };
  }

  return {
    onclick: () => {
      trackPlex();
      webOSHandler.plex(link);
    },
  };
}
