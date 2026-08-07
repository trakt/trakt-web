import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';

function sourceLabel(source: SmartList['source']): string {
  switch (source) {
    case 'trending':
      return m.list_title_trending();
    case 'popular':
      return m.list_title_most_popular();
    case 'anticipated':
      return m.list_title_most_anticipated();
    case 'recommendations':
      return m.list_title_recommended();
    case 'discover':
      return m.button_label_discover();
  }
}

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

function formatRange(key: string, range: number[]): string[] {
  switch (key) {
    case 'years':
      return [formatNumberRange(range, m.advanced_filter_label_release_year)];
    case 'runtimes':
      return [formatNumberRange(range, m.advanced_filter_label_runtime)];
    case 'ratings':
      return [formatPercentRange(range, 'Trakt')];
    case 'imdb_ratings':
      return [`IMDb ${formatPlainRange(range)}`];
    case 'rt_meters':
      return [formatPercentRange(range, 'RT')];
    case 'rt_user_meters':
      return [formatPercentRange(range, 'RT Audience')];
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

  if (value === true && key === 'ignore_watched') {
    return [m.header_hide_watched()];
  }

  if (value === true && key === 'ignore_watchlisted') {
    return [m.header_hide_watchlisted()];
  }

  return [];
}

/*
 * Human-readable summary of a smart list's source and filters, e.g.
 * "Popular, TV-G, TV-Y, TV-Y7". Shared between the smart list card, the
 * smart list shelves, and the smart list detail page.
 */
export function getSmartListFilterSummary(list: SmartList): string {
  const filters = Object.entries(list.filters)
    .flatMap(([key, value]) => formatFilter(key, value));

  return [sourceLabel(list.source), ...filters].join(', ');
}
