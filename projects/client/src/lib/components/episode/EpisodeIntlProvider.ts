import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import { toHumanDate } from '$lib/utils/formatting/date/toHumanDate.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toRelativeHumanDay } from '$lib/utils/formatting/date/toRelativeHumanDay.ts';
import type { EpisodeIntl } from './EpisodeIntl.ts';

export const EpisodeIntlProvider: EpisodeIntl = {
  premiereText: () => m.tag_text_premiere(),
  finaleText: () => m.tag_text_finale(),
  timestampText: ({ date, type }) => {
    const now = new Date();

    switch (type) {
      case EpisodeComputedType.full_season:
      case EpisodeComputedType.multiple_episodes:
        return toRelativeHumanDay(now, date, getLocale());
      default:
        return toHumanDate(now, date, getLocale());
    }
  },
  durationText: (minutes) =>
    toHumanDuration({ minutes, clampAt: 'day' }, languageTag()),
  remainingText: (count) => m.tag_text_remaining_episodes({ count }),
};
