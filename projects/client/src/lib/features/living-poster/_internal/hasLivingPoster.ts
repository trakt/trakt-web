import type { LivingPosterIndex } from '../models/LivingPosterIndex.ts';
import type { LivingPosterTarget } from '../models/LivingPosterTarget.ts';

type HasLivingPosterParams = {
  index: LivingPosterIndex;
  target: LivingPosterTarget;
};

export function hasLivingPoster({ index, target }: HasLivingPosterParams) {
  const ids = target.type === 'movie' ? index.movies : index.shows;

  return ids.has(target.id);
}
