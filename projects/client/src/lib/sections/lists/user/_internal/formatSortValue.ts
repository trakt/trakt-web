import * as m from '$lib/features/i18n/messages.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { getLocale, languageTag } from '../../../../features/i18n/index.ts';
import { isMaxDate } from '../../../../utils/date/isMaxDate.ts';
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
    case 'season':
      return item.entry.season;
  }
}

function getRuntime(item: ListItem) {
  switch (item.type) {
    case 'movie':
      return item.entry.runtime;
    case 'show':
      return item.entry.runtime * item.entry.episode.count;
    case 'episode':
      return item.entry.episode.runtime;
    case 'season':
      return item.entry.show.runtime * item.entry.season.episodes.count;
  }
}

export function formatSortValue(item: ListItem, sortBy?: SortBy) {
  if (!sortBy) {
    return;
  }

  switch (sortBy) {
    case 'added':
      return toHumanDay(item.listedAt, getLocale(), 'short');
    case 'runtime': {
      const runtime = getRuntime(item);
      return toHumanDuration({ minutes: runtime }, languageTag());
    }
    case 'released': {
      const entry = getEntry(item);
      return isMaxDate(entry.airDate)
        ? m.tag_text_tba()
        : toHumanDay(entry.airDate, getLocale(), 'short');
    }
    case 'percentage': {
      const entry = getEntry(item);
      return entry.rating
        ? `${toTraktRating(entry.rating, getLocale())}`
        : undefined;
    }
  }
}
