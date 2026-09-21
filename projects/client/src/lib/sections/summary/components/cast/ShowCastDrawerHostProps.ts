import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';

export type ShowCastDrawerHostProps = {
  slug: string;
  crew: MediaCrew;
  onClose: () => void;
};
