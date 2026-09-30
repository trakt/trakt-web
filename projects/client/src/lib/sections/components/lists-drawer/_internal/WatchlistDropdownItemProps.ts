import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type WatchlistDropdownItemProps = {
  media: MediaEntry;
  type: MediaType;
  title: string;
};
