import * as m from '$lib/features/i18n/messages.ts';
import { episodeNumberLabel } from '$lib/utils/intl/episodeNumberLabel.ts';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';

export function toFriendItemLabel(action: TodayFriendAction): string | null {
  if (action.episode) {
    return episodeNumberLabel({
      seasonNumber: action.episode.season,
      episodeNumber: action.episode.number,
    });
  }
  if (action.season) {
    return m.text_season_number({ number: action.season.number });
  }
  return null;
}
