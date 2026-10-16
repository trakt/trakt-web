import { EXCLUSION_PREFIX } from '$lib/features/filters/exclusionPrefix.ts';
import { parentalGuideFilters } from '$lib/features/filters/parentalGuideFilters.ts';
import { OPEN_VOTES_CEILING } from './openVotesCeiling.ts';
import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLanguageName } from '$lib/utils/formatting/intl/toLanguageName.ts';
import { toHumanCount } from '$lib/utils/formatting/number/toHumanCount.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import { toTitleCaseSlug } from '$lib/utils/formatting/string/toTitleCaseSlug.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { toTranslatedStatus } from '$lib/utils/formatting/string/toTranslatedStatus.ts';

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

function formatRuntimeRange(range: number[]): string {
  const [min, max] = range;

  if (min === 0 && max != null) {
    return m.filter_label_runtime_up_to({ max });
  }

  if (min != null && max != null) {
    return m.advanced_filter_label_runtime({ min, max });
  }

  if (min != null) {
    return m.filter_label_runtime({ range: `${min}+` });
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

const WATCHNOW_LABELS: Record<string, () => string> = {
  favorites: m.option_text_my_favorites,
  subscriptions: m.option_text_streaming_now,
  free: m.list_title_streaming_free,
  any: m.option_text_all_digital_releases,
};

function formatListValue(key: string, value: string): string {
  switch (key) {
    case 'genres':
    case 'subgenres':
      return toTranslatedGenre(value);
    case 'languages':
      return toLanguageName(value, languageTag());
    case 'countries':
      return toCountryName(value.toUpperCase(), languageTag());
    case 'certifications':
      return value.toUpperCase();
    case 'statuses':
      return toTranslatedStatus(value);
    case 'watchnow':
      return WATCHNOW_LABELS[value]?.() ?? toTitleCaseSlug(value);
    default:
      return toTitleCaseSlug(value);
  }
}

function formatList(key: string, values: string[]): string[] {
  return values.map((raw) => {
    if (!raw.startsWith(EXCLUSION_PREFIX)) {
      return formatListValue(key, raw);
    }

    return m.smart_list_filter_label_excluded({
      value: formatListValue(key, raw.slice(EXCLUSION_PREFIX.length)),
    });
  });
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
      return [formatRuntimeRange(range)];
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

export function toSmartListFilterLabel(
  key: string,
  value: unknown,
): string[] {
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
