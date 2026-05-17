import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import { toHumanDate } from '$lib/utils/formatting/date/toHumanDate.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toRelativeHumanDay } from '$lib/utils/formatting/date/toRelativeHumanDay.ts';
import type { EpisodeIntl } from './EpisodeIntl.ts';

function episodeTypeText(type: EpisodeType): string | Nil {
  switch (type) {
    case EpisodePremiereType.series_premiere:
      return m.tag_text_series_premiere();
    case EpisodePremiereType.season_premiere:
      return m.tag_text_season_premiere();
    case EpisodePremiereType.mid_season_premiere:
      return m.tag_text_mid_season_premiere();
    case EpisodeFinaleType.series_finale:
      return m.tag_text_series_finale();
    case EpisodeFinaleType.season_finale:
      return m.tag_text_season_finale();
    case EpisodeFinaleType.mid_season_finale:
      return m.tag_text_mid_season_finale();
    default:
      return;
  }
}

export const EpisodeIntlProvider: EpisodeIntl = {
  premiereText: () => m.tag_text_premiere(),
  finaleText: () => m.tag_text_finale(),
  episodeTypeText,
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
