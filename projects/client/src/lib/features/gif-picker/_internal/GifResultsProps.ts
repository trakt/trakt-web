import type { GifEntry } from '$lib/requests/models/GifEntry.ts';

export type GifResultsProps = {
  customerId: string;
  // Empty means "show what is trending".
  query: string;
  onSelect: (gif: GifEntry) => void;
};
