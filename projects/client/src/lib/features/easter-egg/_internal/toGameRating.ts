import { getLocale } from '$lib/features/i18n/index.ts';
import { toTraktRating } from '$lib/utils/formatting/number/toTraktRating.ts';
import type { GameTitle } from './GameTitle.ts';

export function toGameRating(title: GameTitle): string {
  return toTraktRating(title.rating / 100, getLocale());
}
