import type { Observable } from 'rxjs';
import { offlineActionsStore } from './_internal/offlineActionsStore.ts';
import type { OfflineAction } from './models/OfflineAction.ts';

export function useOfflineActions(): {
  actions: Observable<OfflineAction[]>;
} {
  return {
    actions: offlineActionsStore.actions$,
  };
}
