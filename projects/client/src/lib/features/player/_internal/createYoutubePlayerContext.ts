import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

export const PLAYER_CONTEXT_KEY = Symbol('video_player');

export type PlayerContextType = {
  embedId: Writable<string | Nil>;
  isLoading: Writable<boolean>;
  isPreloaded: Writable<boolean>;
  shouldAutoplay: Writable<boolean>;
};

export function createPlayerContext() {
  const embedId = writable<string | Nil>();
  const isLoading = writable<boolean>(false);
  const shouldAutoplay = writable<boolean>(false);

  const ctx = setContext(
    PLAYER_CONTEXT_KEY,
    getContext<PlayerContextType>(PLAYER_CONTEXT_KEY) ??
      {
        embedId,
        isLoading,
        shouldAutoplay,
      },
  );

  return ctx;
}
