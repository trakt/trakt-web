import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { resolveWatchDate } from '$lib/stores/_internal/resolveWatchDate.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import { hasAired } from '../_internal/hasAired.ts';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

export type MarkAsWatchedStoreProps = MediaStoreProps<
  { id: number; airDate: Date; status?: MediaStatus }
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
    return type === 'movie'
      ? hasAired({ type, status: item.status ?? 'unknown' })
      : hasAired({ type, airDate: item.airDate });
  });

  return {
    markAsWatched,
    removeWatched,
    isWatched,
    isMarkingAsWatched,
    isWatchable,
  };
}
