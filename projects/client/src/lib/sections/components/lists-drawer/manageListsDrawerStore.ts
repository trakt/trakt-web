import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { BehaviorSubject } from 'rxjs';

type ManageListsDrawerProps = {
  media: MediaEntry;
  title: string;
};

export type ManageListsDrawerState =
  | ({ isOpen: boolean } & ManageListsDrawerProps)
  | null;

/**
 * Opens the manage-lists drawer from anywhere - the confirmation toast's
 * "change list" link is the first caller. The drawer is rendered locally in a
 * few surfaces already; this global slot lets code that has no drawer of its
 * own (a toast, a store) request one. Mirrors `markAsWatchedDrawerStore`.
 */
function createManageListsDrawerStore() {
  const subject = new BehaviorSubject<ManageListsDrawerState>(null);

  return {
    subscribe: subject.subscribe.bind(subject),
    open: (state: ManageListsDrawerProps) => {
      subject.next({ ...state, isOpen: true });
    },
    close: () => {
      const current = subject.getValue();
      if (current) subject.next({ ...current, isOpen: false });
    },
  };
}

export const manageListsDrawerStore = createManageListsDrawerStore();
