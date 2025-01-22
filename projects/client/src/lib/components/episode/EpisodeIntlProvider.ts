import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { toHumanDate } from '../../utils/formatting/date/toHumanDate.ts';
import { toHumanDuration } from '../../utils/formatting/date/toHumanDuration.ts';
import type { EpisodeIntl } from './EpisodeIntl.ts';

export const EpisodeIntlProvider: EpisodeIntl = {
  premiereText: ({ type }) => {
    switch (type) {
      case EpisodePremiereType.season_premiere:
        return m.season_premiere();
      case EpisodePremiereType.series_premiere:
        return m.series_premiere();
      case EpisodePremiereType.mid_season_premiere:
        return m.mid_season_premiere();
    }
  },
  finaleText: ({ type }) => {
    switch (type) {
      case EpisodeFinaleType.season_finale:
        return m.season_finale();
      case EpisodeFinaleType.series_finale:
        return m.series_finale();
      case EpisodeFinaleType.mid_season_finale:
        return m.mid_season_finale();
    }
  },
  timestampText: (next) => toHumanDate(new Date(), next, getLocale()),
  durationText: (minutes) => toHumanDuration({ minutes }, languageTag()),
  remainingText: (count) => m.remaining_episodes({ count }),
  fullSeasonText: () => m.full_season(),
};
