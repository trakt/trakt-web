import { BehaviorSubject } from 'rxjs';

const IMPORT_IN_PROGRESS_SOURCE = new BehaviorSubject<boolean>(false);

export function useImportInProgress() {
  return {
    importInProgress: IMPORT_IN_PROGRESS_SOURCE,
  };
}
