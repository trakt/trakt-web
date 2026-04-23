import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { hideRecommendedMovieRequest } from '$lib/requests/queries/recommendations/hideRecommendedMovieRequest.ts';
import { hideRecommendedShowRequest } from '$lib/requests/queries/recommendations/hideRecommendedShowRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

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
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.HideRecommendation);

  const isHiding = new BehaviorSubject(false);

  const hide = async ({ slug, type }: HideRecommendationParams) => {
    track({ type });
    isHiding.next(true);

    const request = typeToRequest(type);

    await request({ slug });
    await invalidate(InvalidateAction.HideRecommended(type));

    isHiding.next(false);
  };

  return {
    isHiding,
    hide,
  };
}
