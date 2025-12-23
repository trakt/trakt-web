import type { ExtendedMediaType } from '../../../requests/models/ExtendedMediaType.ts';
import type { DismissedItem } from './DismissedItem.ts';

export type StoredDismissalsV1 = {
  id: number;
  type: ExtendedMediaType;
  dismissedAt: number;
};

export type StoredDismissalsV2 = {
  version: 2;
  items: DismissedItem[];
  dismissalCount: number;
  isSuppressed: boolean;
};
