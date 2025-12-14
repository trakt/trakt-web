import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';

export const PLAYER_CONTEXT_KEY = Symbol('video_player');

export type PlayerContextType = {
  embedId: BehaviorSubject<string | Nil>;
  isLoading: BehaviorSubject<boolean>;
  isPreloaded: BehaviorSubject<boolean>;
  shouldAutoplay: BehaviorSubject<boolean>;
};

export function createPlayerContext() {
  const embedId = new BehaviorSubject<string | Nil>(null);
  const isLoading = new BehaviorSubject<boolean>(false);
  const isPreloaded = new BehaviorSubject<boolean>(false);
  const shouldAutoplay = new BehaviorSubject<boolean>(false);

  const ctx = setContext(
    PLAYER_CONTEXT_KEY,
    getContext<PlayerContextType>(PLAYER_CONTEXT_KEY) ??
      {
        embedId,
        isLoading,
        isPreloaded,
        shouldAutoplay,
      },
  );

  return ctx;
}
