import type { StreamNow } from '$lib/requests/models/StreamingServiceOptions.ts';

type StreamOnHandler = {
  href: HttpsUrl;
} | {
  onclick: () => void;
};

function getWebOSLinkHandler() {
  const hasWebOSServiceBridge = typeof WebOSServiceBridge !== 'undefined' &&
    WebOSServiceBridge;

  if (!hasWebOSServiceBridge) {
    return;
  }

  // TODO only instantiate once
  const bridge = new WebOSServiceBridge();
  const url = 'luna://com.webos.service.applicationmanager/launch';

  /*
    TODO:
    -deal with youtube
    -deal with plex
    -deal with non-existing apps (getAppLoadStatus instead of launch)
  */
  const handler = (id: string, target: string) => {
    const params = JSON.stringify({
      'id': id,
      'params': {
        contentTarget: target,
      },
    });

    bridge.call(url, params);
  };

  return handler;
}

export function useStreamOnHandler(service: StreamNow): StreamOnHandler {
  return {
    onclick: () => {
      const handler = getWebOSLinkHandler();
      if (!handler || !service.webosLink) {
        return;
      }

      handler(service.webosLink.id, service.webosLink.contentTarget);
    },
  };
  // const deepLinkHandler = getDeepLinkHandler();
  // if (!deepLinkHandler || !service.deepLink) {
  //   return {
  //     href: service.link,
  //   };
  // }

  // const { sources } = useStreamingServices();
  // const source = derived(
  //   sources,
  //   ($sources) => $sources.find((s) => s.source === service.source),
  // );

  // const handler = () => {
  //   const sourceName = get(source)?.name ?? service.source;

  //   deepLinkHandler.open(
  //     sourceName,
  //     assertDefined(service.deepLink, 'Deep link is required'),
  //   );
  // };

  // return {
  //   onclick: handler,
  // };
}
