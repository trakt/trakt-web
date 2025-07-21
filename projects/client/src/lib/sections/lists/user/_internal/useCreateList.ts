import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

export function useCreateList() {
  const isCreating = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ListCreate);

  const createList = async () => {
    // skipcq: JS-0052
    const enteredName = prompt(m.input_prompt_add_list());
    const newName = enteredName?.trim();

    if (!newName) {
      return;
    }

    isCreating.set(true);
    track();

    await createListRequest({
      userId: 'me',
      name: newName,
    });

    await invalidate(InvalidateAction.List.Created);

    isCreating.set(false);
  };

  return {
    isCreating: derived(isCreating, ($isAdding) => $isAdding),
    createList,
  };
}
