import { BehaviorSubject } from 'rxjs';
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
  const store = new BehaviorSubject<MarkAsWatchedDrawerState>(null);

  return {
    subscribe: store.subscribe.bind(store),
    open: (state: MarkAsWatchedProps) => {
      store.next({ ...state, isOpen: true });
    },
    close: () => {
      store.next(null);
    },
  };
}

export const markAsWatchedDrawerStore = createMarkAsWatchedDrawerStore();
