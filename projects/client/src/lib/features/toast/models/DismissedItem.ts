import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

export type DismissedItem = {
  id: number;
  type: ExtendedMediaType;
  dismissedAt: number;
};
