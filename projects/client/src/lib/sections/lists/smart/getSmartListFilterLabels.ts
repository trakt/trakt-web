import { parentalGuideFilters } from '$lib/features/filters/parentalGuideFilters.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { toSmartListSourceLabel } from './toSmartListSourceLabel.ts';
import { toHumanCount } from '$lib/utils/formatting/number/toHumanCount.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';

function toTitleCase(value: string): string {
  return value
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toRatingPercentage(value: number): string {
  return toPercentage(value / 100, languageTag());
}

function formatNumberRange(
  range: number[],
  formatter: (value: { min: number; max: number }) => string,
): string {
  const [min, max] = range;

  if (min != null && max != null) {
    return formatter({ min, max });
  }

  if (min != null) {
    return m.list_summary_range_from({ value: String(min) });
  }

  if (max != null) {
    return m.list_summary_range_up_to({ value: String(max) });
  }

  return '';
}

function formatPlainRange(range: number[]): string {
  const [min, max] = range;

  if (min != null && max != null) {
    return m.list_summary_range_between({
      min: String(min),
      max: String(max),
    });
  }

  if (min != null) {
    return m.list_summary_range_from({ value: String(min) });
  }

  if (max != null) {
    return m.list_summary_range_up_to({ value: String(max) });
  }

  return '';
}

function formatPercentRange(range: number[], label: string): string {
  const [min, max] = range;

  if (min != null && max != null) {
    return m.list_summary_range_labeled_between({
      label,
      min: toRatingPercentage(min),
      max: toRatingPercentage(max),
    });
  }

  if (min != null) {
    return m.list_summary_range_labeled_from({
      label,
      value: toRatingPercentage(min),
    });
  }

  if (max != null) {
    return m.list_summary_range_labeled_up_to({
      label,
      value: toRatingPercentage(max),
    });
  }

  return label;
}

const OPEN_VOTES_CEILING = 999_999_999;

function formatVotesRange(range: number[], source: string): string {
  const [min = 0, max] = range;
  const count = (value: number) => toHumanCount(value, languageTag());

  if (max == null || max >= OPEN_VOTES_CEILING) {
    return m.list_summary_votes_from({ count: count(min), source });
  }

  return m.list_summary_votes_between({
    min: count(min),
    max: count(max),
    source,
  });
}

function formatList(key: string, values: string[]): string[] {
  switch (key) {
    case 'genres':
    case 'subgenres':
      return values.map((genre) => toTranslatedGenre(genre));
    case 'certifications':
    case 'countries':
      return values.map((value) => value.toUpperCase());
    default:
      return values.map(toTitleCase);
  }
}

const PLAIN_RANGE_SOURCES: Record<string, string> = {
  imdb_ratings: 'IMDb',
  tmdb_ratings: 'TMDB',
  letterboxd_ratings: 'Letterboxd',
  mal_ratings: 'MAL',
  metascores: 'Metascore',
};

function formatRange(key: string, range: number[]): string[] {
  const parentalFilter = parentalGuideFilters.find((filter) =>
    filter.key === key
  );
  if (parentalFilter) {
    const [
      min = parentalFilter.range.min,
      max = parentalFilter.range.max,
    ] = range;
    return [parentalFilter.formatLabel({ min, max })];
  }

  const plainRangeSource = PLAIN_RANGE_SOURCES[key];
  if (plainRangeSource) {
    return [`${plainRangeSource} ${formatPlainRange(range)}`];
  }

  switch (key) {
    case 'years':
      return [formatNumberRange(range, m.advanced_filter_label_release_year)];
    case 'runtimes':
      return [formatNumberRange(range, m.advanced_filter_label_runtime)];
    case 'ratings':
      return [formatPercentRange(range, 'Trakt')];
    case 'rt_meters':
      return [formatPercentRange(range, 'RT')];
    case 'rt_user_meters':
      return [formatPercentRange(range, 'RT Audience')];
    case 'votes':
      return [formatVotesRange(range, 'Trakt')];
    case 'imdb_votes':
      return [formatVotesRange(range, 'IMDb')];
    default:
      return [];
  }
}

function formatFilter(key: string, value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.every((item) => typeof item === 'string')
      ? formatList(key, value as string[])
      : formatRange(key, value as number[]);
  }

  if (typeof value === 'number' && key === 'released_within_days') {
    return [m.list_summary_released_within_days({ count: String(value) })];
  }

  if (value === true && key === 'ignore_watched') {
    return [m.header_hide_watched()];
  }

  if (value === true && key === 'ignore_watchlisted') {
    return [m.header_hide_watchlisted()];
  }

  return [];
}

export function getSmartListFilterLabels(
  list: Pick<SmartList, 'source' | 'filters'>,
): string[] {
  const filters = Object.entries(list.filters)
    .flatMap(([key, value]) => formatFilter(key, value));

  return [toSmartListSourceLabel(list.source), ...filters];
}
