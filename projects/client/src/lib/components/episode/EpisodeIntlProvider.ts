import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { toHumanDate } from '$lib/utils/formatting/date/toHumanDate.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import type { EpisodeIntl } from './EpisodeIntl.ts';

export const EpisodeIntlProvider: EpisodeIntl = {
  premiereText: ({ type }) => {
    switch (type) {
      case EpisodePremiereType.season_premiere:
        return m.tag_text_season_premiere();
      case EpisodePremiereType.series_premiere:
        return m.tag_text_series_premiere();
      case EpisodePremiereType.mid_season_premiere:
        return m.tag_text_mid_season_premiere();
    }
  },
  finaleText: ({ type }) => {
    switch (type) {
      case EpisodeFinaleType.season_finale:
        return m.tag_text_season_finale();
      case EpisodeFinaleType.series_finale:
        return m.tag_text_series_finale();
      case EpisodeFinaleType.mid_season_finale:
        return m.tag_text_mid_season_finale();
    }
  },
  timestampText: (next) => toHumanDate(new Date(), next, getLocale()),
  durationText: (minutes) =>
    toHumanDuration({ minutes, clampAt: 'day' }, languageTag()),
  remainingText: (count) => m.tag_text_remaining_episodes({ count }),
  fullSeasonText: () => m.tag_text_full_season(),
};
