import type { MediaDetailsProps } from '../../details/MediaDetailsProps.ts';

export type RatingsDrawerProps =
  & {
    onClose: () => void;
  }
  & MediaDetailsProps;
