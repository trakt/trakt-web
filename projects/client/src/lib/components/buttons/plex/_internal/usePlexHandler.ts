import { getDeepLinkHandler } from '$lib/features/deep-link/getDeepLinkHandler.ts';

type PlexHandler = {
  href: HttpsUrl;
} | {
  onclick: () => void;
};

export function usePlexHandler(link: HttpsUrl): PlexHandler {
  const deepLinkHandler = getDeepLinkHandler();
  if (!deepLinkHandler) {
    return {
      href: link,
    };
  }

  return {
    onclick: () => deepLinkHandler.open('Plex', link),
  };
}
