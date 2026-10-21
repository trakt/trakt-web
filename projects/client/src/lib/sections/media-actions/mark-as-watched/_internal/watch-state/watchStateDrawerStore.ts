import { BehaviorSubject } from 'rxjs';
import type { MarkAsWatchedStoreProps } from '../../useMarkAsWatched.ts';
import type { WatchStateShow } from './WatchStateShow.ts';

type WatchStateProps = {
  title: string;
  show: WatchStateShow;
  mediaStore: MarkAsWatchedStoreProps;
};

type WatchStateDrawerState =
  | ({
      isOpen: boolean;
    } & WatchStateProps)
  | null;

function createWatchStateDrawerStore() {
  const subject = new BehaviorSubject<WatchStateDrawerState>(null);

  return {
    subscribe: subject.subscribe.bind(subject),
    open: (state: WatchStateProps) => {
      subject.next({ ...state, isOpen: true });
    },
    close: () => {
      const current = subject.getValue();
      if (current) {
        subject.next({ ...current, isOpen: false });
      }
    },
  };
}

export const watchStateDrawerStore = createWatchStateDrawerStore();
