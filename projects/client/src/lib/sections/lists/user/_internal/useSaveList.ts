import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ListPrivacy } from '$lib/requests/models/ListPrivacy.ts';
import { createListRequest } from '$lib/requests/queries/users/createListRequest.ts';
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
  const isCreating = props.type === 'create';

  const { track } = useTrack(
    isCreating ? AnalyticsEvent.ListCreate : AnalyticsEvent.ListEdit,
  );

  const save = useMutation(defineMutation({
    key: `list:${props.type}`,
    request: (variables: SaveListProps) =>
      saveRequest({ ...props, ...variables }),
    invalidations: [
      isCreating ? InvalidateAction.List.Created : InvalidateAction.List.Edited,
    ],
  }));

  const saveList = async (
    { name, description, privacy }: SaveListProps,
  ) => {
    const newName = name.trim();
    if (!newName) {
      return;
    }

    track();

    await save.mutate({ name: newName, description, privacy });
  };

  return {
    isSaving: save.isPending,
    saveList,
  };
}
