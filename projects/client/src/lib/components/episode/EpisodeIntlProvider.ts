import { languageTag, locale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/models/EpisodeType.ts';
import { toHumanDate } from '../../utils/formatting/date/toHumanDate.ts';
import { toHumanDuration } from '../../utils/formatting/date/toHumanDuration.ts';
import type { EpisodeIntl } from './EpisodeIntl.ts';

export const EpisodeIntlProvider: EpisodeIntl = {
  premiereText: ({ type }) => {
    switch (type) {
      case EpisodePremiereType.Season:
        return m.season_premiere();
      case EpisodePremiereType.Series:
        return m.series_premiere();
      case EpisodePremiereType.MidSeason:
        return m.mid_season_premiere();
    }
  },
  finaleText: ({ type }) => {
    switch (type) {
      case EpisodeFinaleType.Season:
        return m.season_finale();
      case EpisodeFinaleType.Series:
        return m.series_finale();
      case EpisodeFinaleType.MidSeason:
        return m.mid_season_finale();
    }
  },
  timestampText: (next) => toHumanDate(new Date(), next, locale()),
  durationText: (minutes) => toHumanDuration({ minutes }, languageTag()),
  remainingText: (count) => m.remaining_episodes({ count }),
};
