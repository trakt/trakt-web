import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';

export type DismissedItem = {
  id: string;
  type: ExtendedMediaType;
  dismissedAt: number;
};
