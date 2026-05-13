import { BehaviorSubject } from 'rxjs';

const CLEAR_IN_PROGRESS_SOURCE = new BehaviorSubject<boolean>(false);

export function useClearInProgress() {
  return {
    clearInProgress: CLEAR_IN_PROGRESS_SOURCE,
  };
}
