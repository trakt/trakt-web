import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { dropMovieRequest } from '$lib/requests/queries/users/dropMovieRequest.ts';
import { dropShowRequest } from '$lib/requests/queries/users/dropShowRequest.ts';
import { hideShowCalendarRequest } from '$lib/requests/queries/users/hideShowCalendarRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { useDropNotePrompt } from './_internal/useDropNotePrompt.ts';

type DropProps = {
  id: number;
  type: MediaType;
} & ({ type: 'show' } | { type: 'movie'; playbackId: number });

export type DropStoreProps = DropProps & {
  title: string;
  context?: 'drop' | 'complete';
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
  const { title, context = 'drop', ...target } = props;
  const { user } = useUser();
  const dropNote = useDropNotePrompt();

  const { track } = useTrack(AnalyticsEvent.Drop);

  const dropping = useMutation(defineMutation({
    key: 'media:drop',
    request: async () => {
      await requestDrop(target);
    },
    invalidations: [InvalidateAction.Drop(target.type)],
  }));

  const drop = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    track({ type: target.type });

    await dropping.mutate();

    if (context === 'drop') {
      dropNote?.show({ title, type: target.type, id: target.id });
    }
  };

  return {
    isDropping: dropping.isPending,
    drop,
  };
}
