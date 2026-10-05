import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export type SoundtrackDrawerHostProps = {
  media: MediaEntry;
  currentSeason?: number;
  onClose: () => void;
};
