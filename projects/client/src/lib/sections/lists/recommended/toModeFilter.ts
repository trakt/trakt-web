import type { RecommendationMode } from '$lib/requests/models/RecommendationMode.ts';

export function toModeFilter(mode: RecommendationMode | undefined): {
  mode?: RecommendationMode;
} {
  return mode ? { mode } : {};
}
