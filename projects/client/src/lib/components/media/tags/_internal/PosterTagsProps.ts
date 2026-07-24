import type { DrawerLinkProps } from '$lib/components/media/tags/DrawerLinkProps.ts';
import type { TagIntl } from '$lib/components/media/tags/TagIntl.ts';

export type PosterTagsProps = {
  /**
   * `default` renders a single icon-only indicator (list posters).
   * `full` renders the larger, labelled, stacked tags (summary posters).
   */
  variant?: 'default' | 'full';
  isRewatching?: boolean;
  isWatched?: boolean;
  isPartiallyWatched?: boolean;
  isWatchlisted?: boolean;
  isDropped?: boolean;
  /** Play count, shown on the watched tag in the `full` variant. */
  watchCount?: number;
  postCreditsCount?: number;
  /** Required for labelled tags in the `full` variant. */
  i18n?: TagIntl;
  /** Links the watched tag to the history drawer (`full` variant). */
  historyLink?: DrawerLinkProps;
  /** Links the started/rewatching tags to the seasons drawer (`full` variant). */
  seasonsLink?: DrawerLinkProps;
  onWatchCountClick?: () => void;
};
