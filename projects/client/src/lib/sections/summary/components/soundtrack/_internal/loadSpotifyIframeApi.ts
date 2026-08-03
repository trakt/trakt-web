export type SpotifyEmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (
    event: 'ready' | 'playback_update',
    handler: (payload: { data: { isPaused: boolean } }) => void,
  ) => void;
};

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: string },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
};

type SpotifyGlobal = {
  onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
};

const SCRIPT_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

let pending: Promise<SpotifyIframeApi> | null = null;

// The plain embed iframe needs a second click inside Spotify's own UI before
// anything plays. The iFrame API hands back a controller we can call `play()`
// on, so one click on a row is enough.
export function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (pending) {
    return pending;
  }

  pending = new Promise((resolve) => {
    (globalThis as SpotifyGlobal).onSpotifyIframeApiReady = resolve;

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  });

  return pending;
}
