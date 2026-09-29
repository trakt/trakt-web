import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type {
  YirHighlight,
  YirHighlightKind,
} from '$lib/requests/models/YirPersonaResult.ts';
import { toGroupedNumber } from '$lib/utils/formatting/number/toGroupedNumber.ts';
import type { PersonaStat } from './PersonaStat.ts';

type HighlightFormat = {
  label: () => string;
  unit?: 'percent' | 'decimal' | 'year';
};

const FORMATS: Record<YirHighlightKind, HighlightFormat> = {
  'anime-episodes': { label: m.yir_2026_highlight_anime_episodes },
  'anime-share': { label: m.yir_2026_highlight_anime_share, unit: 'percent' },
  'streak-days': { label: m.yir_2026_highlight_streak_days },
  'premiere-share': {
    label: m.yir_2026_highlight_premiere_share,
    unit: 'percent',
  },
  premieres: { label: m.yir_2026_highlight_premieres },
  'weekend-share': {
    label: m.yir_2026_highlight_weekend_share,
    unit: 'percent',
  },
  'binge-days': { label: m.yir_2026_highlight_binge_days },
  'plays-per-day': {
    label: m.yir_2026_highlight_plays_per_day,
    unit: 'decimal',
  },
  'catalog-share': {
    label: m.yir_2026_highlight_catalog_share,
    unit: 'percent',
  },
  'top-show-episodes': { label: m.yir_2026_highlight_top_show_episodes },
  apps: { label: m.yir_2026_highlight_apps },
  shows: { label: m.yir_2026_highlight_shows },
  networks: { label: m.yir_2026_highlight_networks },
  'checkin-share': {
    label: m.yir_2026_highlight_checkin_share,
    unit: 'percent',
  },
  'new-releases': { label: m.yir_2026_highlight_new_releases },
  'avg-runtime': { label: m.yir_2026_highlight_avg_runtime },
  'avg-vintage': { label: m.yir_2026_highlight_avg_vintage, unit: 'year' },
  'pre-2000': { label: m.yir_2026_highlight_pre_2000 },
  ratings: { label: m.yir_2026_highlight_ratings },
  'avg-rating': { label: m.yir_2026_highlight_avg_rating, unit: 'decimal' },
  'perfect-tens': { label: m.yir_2026_highlight_perfect_tens },
  'top-show-share': {
    label: m.yir_2026_highlight_top_show_share,
    unit: 'percent',
  },
  'genre-share': { label: m.yir_2026_highlight_genre_share, unit: 'percent' },
  movies: { label: m.yir_2026_highlight_movies },
  plays: { label: m.yir_2026_highlight_plays },
  'personas-in-range': { label: m.yir_2026_highlight_personas_in_range },
};

function formatValue(value: number, unit: HighlightFormat['unit']) {
  const locale = getLocale();

  switch (unit) {
    case 'percent':
      return `${toGroupedNumber(value, locale)}%`;
    case 'decimal':
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
        .format(value);
    case 'year':
      return String(value);
    default:
      return toGroupedNumber(value, locale);
  }
}

export function toPersonaStat({ kind, value }: YirHighlight): PersonaStat {
  const format = FORMATS[kind];

  return {
    key: kind,
    value: formatValue(value, format.unit),
    label: format.label(),
  };
}
