import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

export function toDurationLabel(minutes: number) {
  return toHumanDuration({ minutes }, languageTag());
}
