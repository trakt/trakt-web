import { writable } from 'svelte/store';
import type { MarkAsWatchedStoreProps } from '../useMarkAsWatched.ts';

type MarkAsWatchedProps = {
  title: string;
  mediaStore: MarkAsWatchedStoreProps;
};

export type MarkAsWatchedDrawerState =
  | {
    isOpen: boolean;
  } & MarkAsWatchedProps
  | null;

function createMarkAsWatchedDrawerStore() {
  const { subscribe, set } = writable<MarkAsWatchedDrawerState>(null);

  return {
    subscribe,
    open: (state: MarkAsWatchedProps) => {
      set({ ...state, isOpen: true });
    },
    close: () => {
      set(null);
    },
  };
}

export const markAsWatchedDrawerStore = createMarkAsWatchedDrawerStore();
