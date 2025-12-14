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
  const subject = new BehaviorSubject<MarkAsWatchedDrawerState>(null);

  return {
    subscribe: subject.subscribe.bind(subject),
    open: (state: MarkAsWatchedProps) => {
      subject.next({ ...state, isOpen: true });
    },
    close: () => {
      subject.next(null);
    },
  };
}

export const markAsWatchedDrawerStore = createMarkAsWatchedDrawerStore();
