import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { getLocale, languageTag } from '../../../../features/i18n/index.ts';
import { toHumanDay } from '../../../../utils/formatting/date/toHumanDay.ts';
import { toHumanDuration } from '../../../../utils/formatting/date/toHumanDuration.ts';
import { toTraktRating } from '../../../../utils/formatting/number/toTraktRating.ts';
import type { SortBy } from '../models/SortBy.ts';

function getEntry(item: ListItem) {
  switch (item.type) {
    case 'movie':
    case 'show':
      return item.entry;
    case 'episode':
      return item.entry.episode;
    default:
      throw new Error(`Unsupported item type: ${item.type}`);
  }
}

export function formatSortValue(item: ListItem, sortBy?: SortBy) {
  if (sortBy === 'added') {
    return toHumanDay(item.listedAt, getLocale(), 'short');
  }

  if (!sortBy || item.type === 'season') {
    return;
  }

  const entry = getEntry(item);
  switch (sortBy) {
    case 'runtime': {
      const runtime = item.type === 'show'
        ? item.entry.episode.count * item.entry.runtime
        : entry.runtime;

      return toHumanDuration({ minutes: runtime }, languageTag());
    }
    case 'released': {
      return toHumanDay(entry.airDate, getLocale(), 'short');
    }
    case 'percentage': {
      return entry.rating
        ? `${toTraktRating(entry.rating, getLocale())}`
        : undefined;
    }
  }
}
