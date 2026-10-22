import type { RecommendationPeopleReason } from '$lib/requests/models/RecommendationPeopleReason.ts';
import type { RecommendationSource } from '$lib/requests/models/RecommendationSource.ts';

export type RecommendationReasonsDrawerHostProps = {
  type: 'movie' | 'show';
  id: number;
  sources: RecommendationSource[];
  people: RecommendationPeopleReason[];
  title: string;
  onClose: () => void;
};
