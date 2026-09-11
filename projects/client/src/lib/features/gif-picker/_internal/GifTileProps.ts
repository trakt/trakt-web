import type { GifEntry } from '$lib/requests/models/GifEntry.ts';

export type GifTileProps = {
  gif: GifEntry;
  // Resolved once by the grid rather than per tile, so a wall of tiles shares
  // a single media query subscription.
  isReducedMotion: boolean;
  onSelect: () => void;
};
