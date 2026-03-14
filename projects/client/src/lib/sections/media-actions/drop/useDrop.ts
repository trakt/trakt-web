import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useAddNoteDrawer } from '$lib/features/notes/useAddNoteDrawer.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { dropMovieRequest } from '$lib/requests/queries/users/dropMovieRequest.ts';
import { dropShowRequest } from '$lib/requests/queries/users/dropShowRequest.ts';
import { hideShowCalendarRequest } from '$lib/requests/queries/users/hideShowCalendarRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { BehaviorSubject } from 'rxjs';

type DropProps = {
  id: number;
  type: MediaType;
} & ({ type: 'show' } | { type: 'movie'; playbackId: number });

export type DropStoreProps = DropProps & {
  title: string;
};

function requestDrop(props: DropProps) {
  const { id, type } = props;

  if (type === 'show') {
    return Promise.all([
      dropShowRequest({ body: toBulkPayload('show', [id]) }),
      /**
       * FIXME: This is a temporary solution to hide the show from the calendar
       * until we have a nitro version that takes drop state into account
       */
      hideShowCalendarRequest({ body: toBulkPayload('show', [id]) }),
    ]);
  }

  return dropMovieRequest({ id: props.playbackId });
}

export function useDrop(
  props: DropStoreProps,
) {
  const { title, ...target } = props;
  const isDropping = new BehaviorSubject(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { open: openNoteDrawer } = useAddNoteDrawer();

  const { track } = useTrack(AnalyticsEvent.Drop);

  const drop = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    isDropping.next(true);
    track({ type: target.type });

    await requestDrop(target);

    openNoteDrawer({
      type: 'drop',
      mediaType: target.type,
      title,
      id: target.id,
    });

    await invalidate(InvalidateAction.Drop(target.type));

    isDropping.next(false);
  };

  return {
    isDropping,
    drop,
  };
}
