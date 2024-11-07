import type { EpisodeIntl } from './EpisodeIntl.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDate } from '$lib/utils/date/toHumanDate.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/models/EpisodeType.ts';

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
  timestampText: (next) => toHumanDate(new Date(), next, languageTag()),
};
