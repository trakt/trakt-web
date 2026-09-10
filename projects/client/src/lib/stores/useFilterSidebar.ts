import { writable } from '$lib/utils/store/WritableSubject.ts';
import { Subject } from 'rxjs';

const IS_OPEN_SOURCE = writable(false);
const IS_DOCKED_SOURCE = writable(false);
const INTENT_SOURCE = new Subject<boolean>();

function setOpen(isOpen: boolean) {
  IS_OPEN_SOURCE.set(isOpen);

  if (!isOpen) {
    IS_DOCKED_SOURCE.set(false);
  }
}

export function useFilterSidebar() {
  const set = (isOpen: boolean) => {
    setOpen(isOpen);
    INTENT_SOURCE.next(isOpen);
  };

  return {
    isOpen: IS_OPEN_SOURCE.asObservable(),
    isDocked: IS_DOCKED_SOURCE.asObservable(),
    intent: INTENT_SOURCE.asObservable(),
    setDocked: (isDocked: boolean) => IS_DOCKED_SOURCE.set(isDocked),
    open: () => set(true),
    close: () => set(false),
    toggle: () => set(!IS_OPEN_SOURCE.getValue()),
    dismiss: () => setOpen(false),
  };
}
