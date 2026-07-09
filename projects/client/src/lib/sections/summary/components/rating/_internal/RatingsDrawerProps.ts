import type { Season } from '$lib/requests/models/Season.ts';
import type { MediaDetailsProps } from '../../details/MediaDetailsProps.ts';

export type RatingsDrawerProps =
  & {
    onClose: () => void;
    seasons?: Season[];
    elevated?: boolean;
  }
  & MediaDetailsProps;
