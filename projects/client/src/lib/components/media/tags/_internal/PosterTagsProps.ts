import type { DrawerLinkProps } from '$lib/components/media/tags/DrawerLinkProps.ts';
import type { TagIntl } from '$lib/components/media/tags/TagIntl.ts';

type SharedPosterTagsProps = {
  isRewatching?: boolean;
  isWatched?: boolean;
  isPartiallyWatched?: boolean;
  isDropped?: boolean;
  isWatchlisted?: boolean;
};

type DefaultPosterTagsProps = SharedPosterTagsProps & {
  variant?: 'default';
};

type FullPosterTagsProps = SharedPosterTagsProps & {
  variant: 'full';
  i18n: TagIntl;
  watchCount: number;
  postCreditsCount: number;
  historyLink?: DrawerLinkProps;
  seasonsLink?: DrawerLinkProps;
  onWatchCountClick?: () => void;
};

export type PosterTagsProps = DefaultPosterTagsProps | FullPosterTagsProps;
