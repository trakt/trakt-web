import type { ListTarget } from '$lib/models/ListTarget.ts';
import { BehaviorSubject } from 'rxjs';

type ManageListsDrawerProps = {
  target: ListTarget;
  title: string;
  metaInfo?: string;
};

export type ManageListsDrawerState =
  | ({ isOpen: boolean } & ManageListsDrawerProps)
  | null;

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
