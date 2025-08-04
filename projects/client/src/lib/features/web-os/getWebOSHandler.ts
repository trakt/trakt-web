import { launchWebOSApp } from './_internal/launchWebOSApp.ts';

const WEB_OS_YOUTUBE_APP_ID = 'youtube.leanback.v4';
const WEB_OS_PLEX_APP_ID = 'cdp-30';

export function getWebOSHandler() {
  const hasWebOS = typeof webOS !== 'undefined' &&
    webOS;

  if (!hasWebOS) {
    return null;
  }

  const youtube = (url: string) => {
    launchWebOSApp('YouTube', {
      id: WEB_OS_YOUTUBE_APP_ID,
      contentTarget: url,
    });
  };

  const plex = (url: string) => {
    launchWebOSApp('Plex', {
      id: WEB_OS_PLEX_APP_ID,
      contentTarget: url,
    });
  };

  return {
    launch: launchWebOSApp,
    youtube,
    plex,
  };
}
