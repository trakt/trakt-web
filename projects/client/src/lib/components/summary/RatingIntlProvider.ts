import type { RatingIntl } from '$lib/components/summary/RatingIntl.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

export const RatingIntlProvider: RatingIntl = {
  voteText: (count) => toHumanNumber(count, languageTag()),
  viewBreakdownLabel: () => m.button_label_view_ratings_breakdown(),
};
