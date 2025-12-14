import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { updateListRequest } from '$lib/requests/queries/users/updateListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { BehaviorSubject } from 'rxjs';

export function useRenameList(list: MediaListSummary) {
  const isRenaming = new BehaviorSubject(false);
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

    isRenaming.next(true);
    track();

    await updateListRequest({
      userId: assertDefined(
        list.user.slug,
        'Expected user list to have a user slug',
      ),
      listId: list.slug,
      name: newName,
    });

    await invalidate(InvalidateAction.List.Edited);

    isRenaming.next(false);
  };

  return {
    isRenaming: isRenaming.asObservable(),
    renameList,
  };
}
