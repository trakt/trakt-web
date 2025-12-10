import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';

const COVER_CONTEXT_KEY = Symbol('cover');

type CoverData = {
  src: string;
  type: MediaType | 'main';
  colors?: [string, string];
};

type Cover = {
  data: CoverData;
  state: 'change' | 'ready' | 'loading';
} | {
  data: undefined;
  state: 'no-cover';
};

type CoverContextData = {
  cover: BehaviorSubject<Cover>;
};

export function useCover() {
  const { cover } = getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
    setContext(
      COVER_CONTEXT_KEY,
      getContext<CoverContextData>(COVER_CONTEXT_KEY) ??
        {
          cover: new BehaviorSubject<Cover>({
            data: undefined,
            state: 'no-cover',
          }),
        },
    );

  return { cover };
}
