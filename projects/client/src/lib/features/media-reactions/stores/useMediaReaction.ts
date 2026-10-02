import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

import { reactMediaRequest } from '$lib/requests/queries/media/reactMediaRequest.ts';
import { removeMediaReactionsRequest } from '$lib/requests/queries/media/removeMediaReactionsRequest.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';

type MediaTarget = { type: MediaType; slug: string };
type RemoveParams = MediaTarget & { ids: ReadonlyArray<number> };
type ReactParams = MediaTarget & { reaction: MediaReaction };

export function useMediaReaction() {
  const { track } = useTrack(AnalyticsEvent.React);

  const removal = useMutation(defineMutation({
    key: 'media:remove-reaction',
    request: (params: RemoveParams) => removeMediaReactionsRequest(params),
    invalidations: ({ variables }) => [
      InvalidateAction.MediaReact(variables.type),
    ],
  }));

  const reaction = useMutation(defineMutation({
    key: 'media:react',
    request: (params: ReactParams) => reactMediaRequest(params),
    invalidations: ({ variables }) => [
      InvalidateAction.MediaReact(variables.type),
    ],
  }));

  const isReacting = anyTrue([removal.isPending, reaction.isPending]);

  const remove = async (params: RemoveParams) => {
    if (params.ids.length === 0) return;

    track({ action: 'remove', type: params.type });

    await removal.mutate(params);
  };

  const react = async (params: ReactParams) => {
    track({ action: 'add', type: params.type });

    await reaction.mutate(params);
  };

  return {
    isReacting,
    react,
    remove,
  };
}
