import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { whenExecuted } from '$lib/features/offline/whenExecuted.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
import { mediaListIdsRequest } from '$lib/requests/queries/users/mediaListIdsRequest.ts';
import { removeFromListRequest } from '$lib/requests/queries/users/removeFromListRequest.ts';
import type { MixtapeTarget } from './MixtapeTarget.ts';
import { toMixtapePayload } from './toMixtapePayload.ts';

type Media = MovieEntry | ShowEntry;

type Transfer = {
  to: MixtapeTarget;
  add: ReadonlyArray<Media>;
  from: MixtapeTarget;
  remove: ReadonlyArray<Media>;
};

const watchlistInvalidations = [
  InvalidateAction.Watchlisted('movie'),
  InvalidateAction.Watchlisted('show'),
];
const invalidations = [
  ...watchlistInvalidations,
  InvalidateAction.Listed('movie'),
  InvalidateAction.Listed('show'),
];

function addTo(target: MixtapeTarget, media: ReadonlyArray<Media>) {
  const body = toMixtapePayload(media);
  return target == null
    ? addToWatchlistRequest({ body })
    : addToListRequest({ body, listId: target });
}

function removeFrom(target: MixtapeTarget, media: ReadonlyArray<Media>) {
  if (media.length === 0) return Promise.resolve(true);
  const body = toMixtapePayload(media);
  return target == null
    ? removeFromWatchlistRequest({ body })
    : removeFromListRequest({ body, listId: target });
}

async function transferRequest({ to, add, from, remove }: Transfer) {
  return await addTo(to, add) && await removeFrom(from, remove);
}

async function notYetIn(target: MixtapeTarget, media: ReadonlyArray<Media>) {
  if (target == null) return [...media];
  const memberships = await Promise.all(
    media.map(({ type, slug }) => mediaListIdsRequest({ type, slug })),
  );
  return media.filter((_, index) => !memberships[index]?.includes(target));
}

export function useMixtapeSave() {
  const { notify } = useActionToast();

  const watchlisting = useMutation(defineMutation({
    key: 'mixtape:keep-watchlist',
    request: (media: Media) =>
      executeOrEnqueue({
        endpoint: 'watchlist:add',
        keys: [toMediaKey(media.type, media.id)],
        body: toMixtapePayload([media]),
        invalidations: watchlistInvalidations,
      }),
    invalidations: whenExecuted(watchlistInvalidations),
  }));
  const listing = useMutation(defineMutation({
    key: 'mixtape:keep-list',
    request: ({ target, media }: { target: number; media: Media }) =>
      addToListRequest({ body: toMixtapePayload([media]), listId: target }),
    invalidations: [
      InvalidateAction.Listed('movie'),
      InvalidateAction.Listed('show'),
    ],
  }));
  const transferring = useMutation(defineMutation({
    key: 'mixtape:move',
    request: transferRequest,
    invalidations: [...invalidations, InvalidateAction.List.Edited],
  }));
  const creating = useMutation(defineMutation({
    key: 'mixtape:create-list',
    request: (name: string) =>
      createListRequest({ userId: 'me', name, privacy: 'private' }),
    invalidations: [InvalidateAction.List.Created],
  }));

  const keep = async (target: MixtapeTarget, media: Media) => {
    if (target == null) {
      await watchlisting.mutate(media);
      return true;
    }
    const isKept = await listing.mutate({ target, media });
    if (!isKept) {
      notify({
        message: m.text_mixtape_keep_failed({ title: media.title }),
        variant: 'error',
      });
    }
    return isKept;
  };

  const move = async (
    { from, to, toName, media, onMoved }: {
      from: MixtapeTarget;
      to: MixtapeTarget;
      toName: string;
      media: ReadonlyArray<Media>;
      onMoved: (target: MixtapeTarget) => void;
    },
  ) => {
    if (from === to) return true;

    const added = await notYetIn(to, media);
    const isMoved = await transferring.mutate({
      to,
      add: media,
      from,
      remove: media,
    });
    if (!isMoved) {
      notify({ message: m.text_mixtape_move_failed(), variant: 'error' });
      return false;
    }

    onMoved(to);
    notify({
      message: m.text_mixtape_moved({ count: media.length, name: toName }),
      action: {
        text: m.button_text_undo(),
        label: m.button_text_undo(),
        onAction: async () => {
          const isUndone = await transferring.mutate({
            to: from,
            add: media,
            from: to,
            remove: added,
          });
          if (isUndone) onMoved(from);
        },
      },
    });
    return true;
  };

  const createList = (name: string) => creating.mutate(name);

  return { keep, move, createList, isMoving: transferring.isPending };
}
