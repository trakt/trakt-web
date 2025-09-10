import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type DismissedItem = {
  id: number;
  type: MediaType | 'episode';
  dismissedAt: number;
};
