import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';

export type ShowCastDrawerHostProps = {
  slug: string;
  crew: MediaCrew;
  spoiler?: ExtendedMediaStoreProps;
  onClose: () => void;
};
