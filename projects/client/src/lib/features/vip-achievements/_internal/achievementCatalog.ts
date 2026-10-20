import { languageTag } from '$lib/features/i18n/index.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { toGroupedNumber } from '$lib/utils/formatting/number/toGroupedNumber.ts';
import { collectRatingValues } from './collectRatingValues.ts';
import {
  computeLongestStreak,
  countDoubleFeatures,
  countMarathonDays,
  countNightOwlPlays,
} from './historyMetrics.ts';
import type { VipAchievementDefinition } from './VipAchievementDefinition.ts';

const MINUTES_PER_HOUR = 60;

const toCount = (threshold: number) =>
  toGroupedNumber(threshold, languageTag());

const toHours = (minutes: number | Nil) =>
  Math.floor((minutes ?? 0) / MINUTES_PER_HOUR);

/**
 * The tiered achievement catalog. Metrics read only from already-loaded client
 * data (see `VipAchievementMetricInput`) and are compared against ascending
 * tier thresholds. Adding an achievement is a single new entry; adding a tier
 * is one number; adding a category is one entry in `achievementCategories`.
 */
export const achievementCatalog: ReadonlyArray<VipAchievementDefinition> = [
  {
    id: 'century-club',
    category: 'watching',
    title: m.vip_achievement_century_club_title,
    description: m.vip_achievement_century_club_description,
    step: (threshold) =>
      m.vip_achievement_century_club_step({ count: toCount(threshold) }),
    thresholds: [1_000, 5_000, 25_000, 100_000],
    metric: ({ stats }) => stats?.totalPlays ?? 0,
  },
  {
    id: 'time-spent-episodes',
    category: 'watching',
    title: m.vip_achievement_time_spent_episodes_title,
    description: m.vip_achievement_time_spent_episodes_description,
    step: (threshold) =>
      m.vip_achievement_time_spent_episodes_step({
        count: toCount(threshold),
      }),
    thresholds: [500, 2_000, 8_000],
    metric: ({ stats }) => toHours(stats?.episodes.minutes),
  },
  {
    id: 'time-spent-movies',
    category: 'watching',
    title: m.vip_achievement_time_spent_movies_title,
    description: m.vip_achievement_time_spent_movies_description,
    step: (threshold) =>
      m.vip_achievement_time_spent_movies_step({ count: toCount(threshold) }),
    thresholds: [150, 800, 4_000],
    metric: ({ stats }) => toHours(stats?.movies.minutes),
  },
  {
    id: 'show-completionist',
    category: 'watching',
    title: m.vip_achievement_show_completionist_title,
    description: m.vip_achievement_show_completionist_description,
    step: (threshold) =>
      m.vip_achievement_show_completionist_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 100, 250],
    metric: ({ stats }) => stats?.progress?.finished ?? 0,
  },
  {
    id: 'daily-streak',
    category: 'habits',
    title: m.vip_achievement_daily_streak_title,
    description: m.vip_achievement_daily_streak_description,
    step: (threshold) =>
      m.vip_achievement_daily_streak_step({ count: toCount(threshold) }),
    thresholds: [7, 30, 100, 365],
    metric: ({ history }) => computeLongestStreak(history),
  },
  {
    id: 'night-owl',
    category: 'habits',
    title: m.vip_achievement_night_owl_title,
    description: m.vip_achievement_night_owl_description,
    step: (threshold) =>
      m.vip_achievement_night_owl_step({ count: toCount(threshold) }),
    thresholds: [5, 25, 100],
    metric: ({ history }) => countNightOwlPlays(history),
  },
  {
    id: 'marathon-fever',
    category: 'habits',
    title: m.vip_achievement_marathon_fever_title,
    description: m.vip_achievement_marathon_fever_description,
    step: (threshold) =>
      threshold === 1
        ? m.vip_achievement_marathon_fever_step_one()
        : m.vip_achievement_marathon_fever_step_other({
            count: toCount(threshold),
          }),
    thresholds: [1, 5, 20],
    metric: ({ history }) => countMarathonDays(history),
  },
  {
    id: 'double-feature',
    category: 'habits',
    title: m.vip_achievement_double_feature_title,
    description: m.vip_achievement_double_feature_description,
    step: (threshold) =>
      threshold === 1
        ? m.vip_achievement_double_feature_step_one()
        : m.vip_achievement_double_feature_step_other({
            count: toCount(threshold),
          }),
    thresholds: [1, 5, 10, 25],
    metric: ({ history }) => countDoubleFeatures(history),
  },
  {
    id: 'rating-machine',
    category: 'ratings',
    title: m.vip_achievement_rating_machine_title,
    description: m.vip_achievement_rating_machine_description,
    step: (threshold) =>
      m.vip_achievement_rating_machine_step({ count: toCount(threshold) }),
    thresholds: [100, 500, 2_500, 10_000],
    metric: ({ ratings }) => collectRatingValues(ratings).length,
  },
  {
    id: 'perfect-ten',
    category: 'ratings',
    title: m.vip_achievement_perfect_ten_title,
    description: m.vip_achievement_perfect_ten_description,
    step: (threshold) =>
      threshold === 1
        ? m.vip_achievement_perfect_ten_step_one()
        : m.vip_achievement_perfect_ten_step_other({
            count: toCount(threshold),
          }),
    thresholds: [1, 10, 50, 100],
    metric: ({ ratings }) =>
      collectRatingValues(ratings).filter((rating) => rating === 10).length,
  },
  {
    id: 'scribe',
    category: 'ratings',
    title: m.vip_achievement_scribe_title,
    description: m.vip_achievement_scribe_description,
    step: (threshold) =>
      m.vip_achievement_scribe_step({ count: toCount(threshold) }),
    thresholds: [5, 25, 100, 250],
    metric: ({ stats }) =>
      stats
        ? stats.movies.comments +
          stats.shows.comments +
          stats.seasons.comments +
          stats.episodes.comments
        : 0,
  },
  {
    id: 'list-maker',
    category: 'lists',
    title: m.vip_achievement_list_maker_title,
    description: m.vip_achievement_list_maker_description,
    step: (threshold) =>
      m.vip_achievement_list_maker_step({ count: toCount(threshold) }),
    thresholds: [3, 10, 25],
    metric: ({ stats }) => stats?.lists ?? 0,
  },
];
