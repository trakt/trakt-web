import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';

//TODO intl + matching icons
export const TraktIntlProvider: MarkAsWatchedButtonIntl = {
  label: ({ isWatched, title }: MarkAsWatchedButtonMeta) =>
    isWatched ? 'Track' : 'Trakt',
  text: ({ isWatched, isRewatching }: MarkAsWatchedButtonMeta) =>
    isWatched ? 'Track' : 'Trakt',
};
