import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { hideRecommendedMovieRequest } from '$lib/requests/queries/recommendations/hideRecommendedMovieRequest.ts';
import { hideRecommendedShowRequest } from '$lib/requests/queries/recommendations/hideRecommendedShowRequest.ts';

export type HideRecommendationParams = {
  slug: string;
  type: MediaType;
};

function typeToRequest(type: MediaType) {
  switch (type) {
    case 'movie':
      return hideRecommendedMovieRequest;
    case 'show':
      return hideRecommendedShowRequest;
  }
}

export function useHideRecommendation() {
  const { track } = useTrack(AnalyticsEvent.HideRecommendation);

  const hiding = useMutation(defineMutation({
    key: 'recommendation:hide',
    request: ({ slug, type }: HideRecommendationParams) =>
      typeToRequest(type)({ slug }),
    invalidations: ({ variables }) => [
      InvalidateAction.HideRecommended(variables.type),
    ],
  }));

  const hide = async (params: HideRecommendationParams) => {
    track({ type: params.type });

    await hiding.mutate(params);
  };

  return {
    isHiding: hiding.isPending,
    hide,
  };
}
