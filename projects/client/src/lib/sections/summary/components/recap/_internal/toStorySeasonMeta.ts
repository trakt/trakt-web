import * as m from '$lib/features/i18n/messages.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import { isMaxDate } from '$lib/utils/date/isMaxDate.ts';
import { isUnknownDate } from '$lib/utils/date/isUnknownDate.ts';

export function toStorySeasonMeta(
  season: Pick<Season, 'episodes' | 'airDate'> | Nil,
): string | null {
  if (!season) {
    return null;
  }

  const episodes = m.tag_text_number_of_episodes({
    count: season.episodes.count,
  });

  if (isMaxDate(season.airDate) || isUnknownDate(season.airDate)) {
    return episodes;
  }

  return m.text_recap_meta_pair({
    first: `${season.airDate.getFullYear()}`,
    second: episodes,
  });
}
