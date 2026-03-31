import * as m from '$lib/features/i18n/messages.ts';
import type { FavoritedEntry } from '$lib/requests/models/FavoritedEntry.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { getLocale, languageTag } from '../../../../features/i18n/index.ts';
import { isMaxDate } from '../../../../utils/date/isMaxDate.ts';
import { toHumanDay } from '../../../../utils/formatting/date/toHumanDay.ts';
import { toHumanDuration } from '../../../../utils/formatting/date/toHumanDuration.ts';
import { toTraktRating } from '../../../../utils/formatting/number/toTraktRating.ts';
import type { SortBy } from '../models/SortBy.ts';

export type SortInput = ListItem | FavoritedEntry;

function isFavorited(item: SortInput): item is FavoritedEntry {
  return 'favoritedAt' in item;
}

function getAddedAt(item: SortInput): Date {
  return isFavorited(item) ? item.favoritedAt : item.listedAt;
}

function getListItemEntry(item: ListItem) {
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

function getRuntimeMinutes(item: SortInput): number {
  if (isFavorited(item)) {
    const { item: media } = item;
    return 'episode' in media
      ? media.runtime * media.episode.count
      : media.runtime;
  }

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

function getAirDate(item: SortInput): Date {
  if (isFavorited(item)) return item.item.airDate;
  return getListItemEntry(item).airDate;
}

function getTitle(item: SortInput): string {
  if (isFavorited(item)) return item.item.title;

  switch (item.type) {
    case 'movie':
    case 'show':
      return item.entry.title;
    case 'episode':
      return item.entry.episode.title;
    case 'season':
      return item.entry.show.title;
  }
}

function getRating(item: SortInput): number | null | undefined {
  if (isFavorited(item)) return item.item.rating;
  return getListItemEntry(item).rating;
}

export function formatSortValue(item: SortInput, sortBy?: SortBy) {
  if (!sortBy) {
    return;
  }

  switch (sortBy) {
    case 'added':
      return toHumanDay(getAddedAt(item), getLocale(), 'short');
    case 'runtime': {
      const runtime = getRuntimeMinutes(item);
      return toHumanDuration({ minutes: runtime }, languageTag());
    }
    case 'released': {
      const airDate = getAirDate(item);
      return isMaxDate(airDate)
        ? m.tag_text_tba()
        : toHumanDay(airDate, getLocale(), 'short');
    }
    case 'percentage': {
      const rating = getRating(item);
      return rating ? `${toTraktRating(rating, getLocale())}` : undefined;
    }
    case 'title':
      return getTitle(item)[0]?.toUpperCase();
  }
}
