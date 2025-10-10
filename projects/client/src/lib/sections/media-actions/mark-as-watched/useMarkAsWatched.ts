import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { resolveWatchDate } from '$lib/stores/_internal/resolveWatchDate.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import type { MediaStoreProps } from '../../../models/MediaStoreProps.ts';
import { hasAired } from '../_internal/hasAired.ts';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

export type MarkAsWatchedStoreProps = MediaStoreProps<
  { id: number; airDate: Date }
>;

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isMarkingAsWatched = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.MarkAsWatched);

  const { isWatched } = useIsWatched(props);

  const markAsWatched = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    const watchedAtDate = resolveWatchDate(
      current.preferences.watch.action,
    );

    if (!watchedAtDate) {
      return;
    }

    isMarkingAsWatched.set(true);
    track({ action: 'add' });

    await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(props, watchedAtDate),
    });

    await invalidate(InvalidateAction.MarkAsWatched(type));

    isMarkingAsWatched.set(false);
  };

  const removeWatched = async () => {
    isMarkingAsWatched.set(true);
    track({ action: 'remove' });

    await removeWatchedRequest({
      body: toMarkAsWatchedPayload(props),
    });

    await invalidate(InvalidateAction.MarkAsWatched(type));

    isMarkingAsWatched.set(false);
  };

  const isWatchable = media.every((item) => {
    return item.airDate && hasAired({ airDate: item.airDate, type });
  });

  return {
    markAsWatched,
    removeWatched,
    isWatched,
    isMarkingAsWatched,
    isWatchable,
  };
}
