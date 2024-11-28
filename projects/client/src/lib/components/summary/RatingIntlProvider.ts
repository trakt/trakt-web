import type { RatingIntl } from '$lib/components/summary/RatingIntl.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

export const RatingIntlProvider: RatingIntl = {
  voteText: (count) => toHumanNumber(count, languageTag()),
};
