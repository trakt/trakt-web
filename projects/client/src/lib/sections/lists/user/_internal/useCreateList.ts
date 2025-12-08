import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListPrivacy } from '$lib/requests/models/ListPrivacy.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

type CreateListProps = {
  name: string;
  description?: string;
  privacy: ListPrivacy;
};

export function useCreateList() {
  const isCreating = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.ListCreate);

  const createList = async (
    { name, description, privacy }: CreateListProps,
  ) => {
    const newName = name.trim();
    if (!newName) {
      return;
    }

    isCreating.set(true);
    track();

    await createListRequest({
      userId: 'me',
      name: newName,
      description: description?.trim(),
      privacy,
    });

    await invalidate(InvalidateAction.List.Created);

    isCreating.set(false);
  };

  return {
    isCreating: derived(isCreating, ($isAdding) => $isAdding),
    createList,
  };
}
