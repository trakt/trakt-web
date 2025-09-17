import type {
  MarkAsWatchedButtonIntl,
  MarkAsWatchedButtonMeta,
} from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl.ts';
import { MarkAsWatchedButtonIntlProvider } from '$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntlProvider.ts';

export const TrackIntlProvider: MarkAsWatchedButtonIntl = {
  label: MarkAsWatchedButtonIntlProvider.label,
  text: ({ isWatched, isRewatching, title }: MarkAsWatchedButtonMeta) => {
    const isRemovable = isWatched && !isRewatching;
    if (isRemovable) {
      return MarkAsWatchedButtonIntlProvider.text({
        isWatched,
        isRewatching,
        title,
      });
    }

    return 'Track';
  },
};
