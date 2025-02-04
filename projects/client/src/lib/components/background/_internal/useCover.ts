import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

const COVER_CONTEXT_KEY = Symbol('cover');

type CoverData = {
  src: string;
  type: MediaType | 'main';
};

type CoverContextData = {
  cover: Writable<CoverData>;
  state: Writable<'change' | 'ready' | 'loading'>;
};

export function useCover(initial?: CoverData) {
  const { cover, state } = getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
    setContext(
      COVER_CONTEXT_KEY,
      getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
        {
          cover: writable(initial),
          state: writable('loading'),
        },
    );

  return { cover, state };
}
