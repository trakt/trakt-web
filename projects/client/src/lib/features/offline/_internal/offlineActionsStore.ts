import { browser } from '$app/environment';
import { createOfflineActionsStorage } from './createOfflineActionsStorage.ts';
import {
  createOfflineActionsStore,
  type OfflineActionsStore,
} from './createOfflineActionsStore.ts';
import type { OfflineActionsStorage } from './OfflineActionsStorage.ts';
import { hasIndexedDb } from '$lib/utils/storage/hasIndexedDb.ts';

const memoryStorage: OfflineActionsStorage = {
  read: () => Promise.resolve([]),
  write: () => Promise.resolve(),
};

function resolveStorage(): OfflineActionsStorage {
  if (!browser || !hasIndexedDb()) {
    return memoryStorage;
  }

  return createOfflineActionsStorage();
}

export const offlineActionsStore: OfflineActionsStore =
  createOfflineActionsStore(resolveStorage());
