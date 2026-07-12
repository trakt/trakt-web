import type { OfflineAction } from '../models/OfflineAction.ts';

export type OfflineActionsStorage = {
  read: () => Promise<OfflineAction[]>;
  write: (actions: OfflineAction[]) => Promise<void>;
};
