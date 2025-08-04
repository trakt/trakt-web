import { getWebOSHandler } from '$lib/features/web-os/getWebOSHandler.ts';

type PlexHandler = {
  href: HttpsUrl;
} | {
  onclick: () => void;
};

export function usePlexHandler(link: HttpsUrl): PlexHandler {
  const webOSHandler = getWebOSHandler();
  if (!webOSHandler) {
    return {
      href: link,
    };
  }

  return {
    onclick: () => webOSHandler.plex(link),
  };
}
