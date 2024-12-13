import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

const COVER_CONTEXT_KEY = Symbol('cover');

type CoverContextData = Writable<string>;

export function useCover(initialCover?: string) {
  const cover = getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
    setContext(
      COVER_CONTEXT_KEY,
      getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
        writable<string>(initialCover),
    );

  return cover;
}
