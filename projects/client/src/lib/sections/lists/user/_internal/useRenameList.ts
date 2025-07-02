import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { updateListRequest } from '$lib/requests/queries/users/updateListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, writable } from 'svelte/store';

export function useRenameList(list: MediaListSummary) {
  const { user } = useUser();
  const isRenaming = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ListRename);

  const renameList = async () => {
    // skipcq: JS-0052
    const enteredName = prompt(
      m.input_prompt_rename_list(),
      list.name,
    );

    if (!enteredName) {
      return;
    }

    const newName = enteredName.trim();
    if (newName === list.name) {
      return;
    }

    isRenaming.set(true);
    track();

    await updateListRequest({
      userId: assertDefined(
        list.user.slug,
        'Expected user list to have a user slug',
      ),
      listId: list.slug,
      name: newName,
    });

    await invalidate(InvalidateAction.ListRenamed);

    isRenaming.set(false);
  };

  return {
    isEditable: derived(user, ($user) => $user.slug === list.user.slug),
    isRenaming: derived(isRenaming, ($isRenaming) => $isRenaming),
    renameList,
  };
}
