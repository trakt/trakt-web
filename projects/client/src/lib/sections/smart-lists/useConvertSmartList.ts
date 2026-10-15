import type { SmartListWriteRequest } from '@trakt/api';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { SmartListDraft } from '$lib/requests/models/SmartListDraft.ts';
import { convertToSmartListRequest } from '$lib/requests/queries/users/convertToSmartListRequest.ts';
import { AnalyticsEvent } from '../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../features/analytics/useTrack.ts';

type ConvertListProps = {
  listId: string;
  name: string;
  draft: SmartListDraft;
  privacy: SmartListWriteRequest['privacy'];
};

function toConvertRequest(
  { listId, name, draft, privacy }: ConvertListProps,
) {
  return convertToSmartListRequest({
    listId,
    body: {
      name: name.trim(),
      source: draft.source,
      media_type: draft.mediaType,
      filters: draft.filters,
      privacy,
    },
  });
}

export function useConvertSmartList() {
  const { track } = useTrack(AnalyticsEvent.SmartListCreate);

  const conversion = useMutation(defineMutation({
    key: 'smart-list:convert',
    request: toConvertRequest,
    invalidations: [
      InvalidateAction.SmartList.Created,
      InvalidateAction.List.Edited,
    ],
  }));

  const convertList = async (props: ConvertListProps) => {
    track();

    return await conversion.mutate(props).catch(() => null);
  };

  return {
    convertList,
    isConverting: conversion.isPending,
  };
}
