import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListPrivacy } from '$lib/requests/models/ListPrivacy.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import { updateListRequest } from '../../../../requests/queries/users/updateListRequest.ts';

type SaveListProps = {
  name: string;
  description?: string;
  privacy: ListPrivacy;
};

type CreateListProps = {
  type: 'create';
};

type UpdateListProps = {
  type: 'update';
  listId: string;
};

export type UseSaveListProps = CreateListProps | UpdateListProps;

function saveRequest(props: UseSaveListProps & SaveListProps) {
  const { type } = props;

  const payload = {
    userId: 'me',
    name: props.name,
    description: props.description,
    privacy: props.privacy,
  };

  switch (type) {
    case 'create':
      return createListRequest(payload);
    case 'update':
      return updateListRequest({
        ...payload,
        listId: props.listId,
      });
  }
}

export function useSaveList(props: UseSaveListProps) {
  const isSaving = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();

  const invalidateAction = props.type === 'create'
    ? InvalidateAction.List.Created
    : InvalidateAction.List.Edited;
  const analyticsEvent = props.type === 'create'
    ? AnalyticsEvent.ListCreate
    : AnalyticsEvent.ListEdit;
  const { track } = useTrack(analyticsEvent);

  const saveList = async (
    { name, description, privacy }: SaveListProps,
  ) => {
    const newName = name.trim();
    if (!newName) {
      return;
    }

    isSaving.next(true);
    track();

    await saveRequest({
      ...props,
      name: newName,
      description,
      privacy,
    });

    await invalidate(invalidateAction);

    isSaving.next(false);
  };

  return {
    isSaving: isSaving.asObservable(),
    saveList,
  };
}
