import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToListRequest } from '$lib/requests/queries/users/addToListRequest.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import type { BulkAddPick } from './BulkAddPick.ts';
import { toBulkAddPayload } from './toBulkAddPayload.ts';

function toAddedMessage({ count, name }: { count: number; name: string }) {
  return count === 1
    ? m.text_added_title_to_list({ name })
    : m.text_added_titles_to_list({ count, name });
}

export function useBulkAddToList(list: MediaListSummary) {
  const { track } = useTrack(AnalyticsEvent.List);
  const { notify } = useActionToast();

  const addition = useMutation(defineMutation({
    key: 'list:bulk-add',
    request: (picks: ReadonlyArray<BulkAddPick>) =>
      addToListRequest({
        listId: list.id,
        userId: list.user.slug,
        body: toBulkAddPayload(picks),
      }),
    invalidations: [
      InvalidateAction.Listed('movie'),
      InvalidateAction.Listed('show'),
    ],
  }));

  const addPicks = async (picks: ReadonlyArray<BulkAddPick>) => {
    if (picks.length === 0) return false;

    track({ action: 'add' });

    const isAdded = await addition.mutate(picks);

    notify(
      isAdded
        ? { message: toAddedMessage({ count: picks.length, name: list.name }) }
        : {
          message: m.text_failed_to_add_titles({ name: list.name }),
          variant: 'error',
        },
    );

    return isAdded;
  };

  return { addPicks, isAdding: addition.isPending };
}
