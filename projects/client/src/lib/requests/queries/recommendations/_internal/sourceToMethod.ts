import type { RecommendationSourceParams } from '$lib/requests/queries/recommendations/RecommendationSourceParams.ts';

export function sourceToMethod(props: RecommendationSourceParams) {
  switch (props.source) {
    case 'social':
      return 'social_recommendations' as const;
    default:
      return 'recommendations' as const;
  }
}
