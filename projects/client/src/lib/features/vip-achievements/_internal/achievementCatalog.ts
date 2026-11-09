import { languageTag } from '$lib/features/i18n/index.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { toGroupedNumber } from '$lib/utils/formatting/number/toGroupedNumber.ts';
import { collectRatingValues } from './collectRatingValues.ts';
import {
  computeLongestStreak,
  computeLongestWeeklyRun,
  countActiveDays,
  countDoubleFeatures,
  countEarlyBirdPlays,
  countLeapDayPlays,
  countLongHaulShows,
  countMarathonDays,
  countNewYearPlays,
  countNightOwlPlays,
  countSameDayMovieRewatches,
} from './historyMetrics.ts';
import {
  countInstantVerdicts,
  countLowRatings,
  countStarLevels,
} from './ratingMetrics.ts';
import { toWholeYearsSince } from './toWholeYearsSince.ts';
import type { VipAchievementDefinition } from './VipAchievementDefinition.ts';

const MINUTES_PER_HOUR = 60;

const toCount = (threshold: number) =>
  toGroupedNumber(threshold, languageTag());

const STAR_LEVELS = 5;

const toHours = (minutes: number | Nil) =>
  Math.floor((minutes ?? 0) / MINUTES_PER_HOUR);

const secretStep = () => m.vip_achievements_secret_description();

const trackedCatalog: ReadonlyArray<VipAchievementDefinition> = [
  {
    id: 'opening-credits',
    category: 'getting-started',
    title: m.vip_achievement_opening_credits_title,
    description: m.vip_achievement_opening_credits_description,
    step: () => m.vip_achievement_opening_credits_step(),
    thresholds: [1],
    metric: ({ milestones }) => (milestones?.has('opening-credits') ? 1 : 0),
  },
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
  {
    id: 'feature-presentation',
    category: 'watching',
    title: m.vip_achievement_feature_presentation_title,
    description: m.vip_achievement_feature_presentation_description,
    step: (threshold) =>
      m.vip_achievement_feature_presentation_step({
        count: toCount(threshold),
      }),
    thresholds: [50, 250, 1_000, 2_500],
    metric: ({ stats }) => stats?.movies.watched ?? 0,
  },
  {
    id: 'pilot-season',
    category: 'watching',
    title: m.vip_achievement_pilot_season_title,
    description: m.vip_achievement_pilot_season_description,
    step: (threshold) =>
      m.vip_achievement_pilot_season_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 150, 400],
    metric: ({ stats }) => stats?.shows.watched ?? 0,
  },
  {
    id: 'nostalgia-trip',
    category: 'watching',
    title: m.vip_achievement_nostalgia_trip_title,
    description: m.vip_achievement_nostalgia_trip_description,
    step: (threshold) =>
      m.vip_achievement_nostalgia_trip_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 200, 1_000],
    metric: ({ stats }) =>
      stats
        ? stats.movies.plays -
          stats.movies.watched +
          (stats.episodes.plays - stats.episodes.watched)
        : 0,
  },
  {
    id: 'long-haul',
    category: 'watching',
    title: m.vip_achievement_long_haul_title,
    description: m.vip_achievement_long_haul_description,
    step: (threshold) =>
      threshold === 1
        ? m.vip_achievement_long_haul_step_one()
        : m.vip_achievement_long_haul_step_other({
            count: toCount(threshold),
          }),
    thresholds: [1, 5, 15],
    metric: ({ history }) => countLongHaulShows(history),
  },
  {
    id: 'early-bird',
    category: 'habits',
    title: m.vip_achievement_early_bird_title,
    description: m.vip_achievement_early_bird_description,
    step: (threshold) =>
      m.vip_achievement_early_bird_step({ count: toCount(threshold) }),
    thresholds: [5, 25, 100],
    metric: ({ history }) => countEarlyBirdPlays(history),
  },
  {
    id: 'season-ticket',
    category: 'habits',
    title: m.vip_achievement_season_ticket_title,
    description: m.vip_achievement_season_ticket_description,
    step: (threshold) =>
      m.vip_achievement_season_ticket_step({ count: toCount(threshold) }),
    thresholds: [50, 200, 500, 1_000],
    metric: ({ history }) => countActiveDays(history),
  },
  {
    id: 'weekly-ritual',
    category: 'habits',
    title: m.vip_achievement_weekly_ritual_title,
    description: m.vip_achievement_weekly_ritual_description,
    step: (threshold) =>
      m.vip_achievement_weekly_ritual_step({ count: toCount(threshold) }),
    thresholds: [4, 12, 26, 52],
    metric: ({ history }) => computeLongestWeeklyRun(history),
  },
  {
    id: 'full-spectrum',
    category: 'ratings',
    title: m.vip_achievement_full_spectrum_title,
    description: m.vip_achievement_full_spectrum_description,
    step: () => m.vip_achievement_full_spectrum_step(),
    thresholds: [1],
    metric: ({ ratings }) => (countStarLevels(ratings) === STAR_LEVELS ? 1 : 0),
  },
  {
    id: 'hard-to-please',
    category: 'ratings',
    title: m.vip_achievement_hard_to_please_title,
    description: m.vip_achievement_hard_to_please_description,
    step: (threshold) =>
      m.vip_achievement_hard_to_please_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 100],
    metric: ({ ratings }) => countLowRatings(ratings),
  },
  {
    id: 'instant-verdict',
    category: 'ratings',
    title: m.vip_achievement_instant_verdict_title,
    description: m.vip_achievement_instant_verdict_description,
    step: (threshold) =>
      m.vip_achievement_instant_verdict_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 200],
    metric: ({ history, ratings }) =>
      countInstantVerdicts({ history, ratings }),
  },
  {
    id: 'episode-by-episode',
    category: 'ratings',
    title: m.vip_achievement_episode_by_episode_title,
    description: m.vip_achievement_episode_by_episode_description,
    step: (threshold) =>
      m.vip_achievement_episode_by_episode_step({ count: toCount(threshold) }),
    thresholds: [50, 250, 1_000],
    metric: ({ ratings }) => ratings?.episodes.size ?? 0,
  },
  {
    id: 'hall-of-fame',
    category: 'lists',
    title: m.vip_achievement_hall_of_fame_title,
    description: m.vip_achievement_hall_of_fame_description,
    step: (threshold) =>
      m.vip_achievement_hall_of_fame_step({ count: toCount(threshold) }),
    thresholds: [10, 25, 50],
    metric: ({ favorites }) =>
      favorites ? favorites.movies.size + favorites.shows.size : 0,
  },
  {
    id: 'shelf-life',
    category: 'lists',
    title: m.vip_achievement_shelf_life_title,
    description: m.vip_achievement_shelf_life_description,
    step: (threshold) =>
      m.vip_achievement_shelf_life_step({ count: toCount(threshold) }),
    thresholds: [50, 250, 1_000, 5_000],
    metric: ({ collection }) =>
      collection ? collection.movies.size + collection.episodes.size : 0,
  },
  {
    id: 'ensemble-cast',
    category: 'social',
    title: m.vip_achievement_ensemble_cast_title,
    description: m.vip_achievement_ensemble_cast_description,
    step: (threshold) =>
      m.vip_achievement_ensemble_cast_step({ count: toCount(threshold) }),
    thresholds: [5, 25, 100],
    metric: ({ stats }) => stats?.network.following ?? 0,
  },
  {
    id: 'fan-club',
    category: 'social',
    title: m.vip_achievement_fan_club_title,
    description: m.vip_achievement_fan_club_description,
    step: (threshold) =>
      m.vip_achievement_fan_club_step({ count: toCount(threshold) }),
    thresholds: [10, 50, 250, 1_000],
    metric: ({ stats }) => stats?.network.followers ?? 0,
  },
  {
    id: 'trakt-pioneer',
    category: 'legacy',
    title: m.vip_achievement_trakt_pioneer_title,
    description: m.vip_achievement_trakt_pioneer_description,
    step: (threshold) =>
      threshold === 1
        ? m.vip_achievement_trakt_pioneer_step_one()
        : m.vip_achievement_trakt_pioneer_step_other({
            count: toCount(threshold),
          }),
    thresholds: [1, 3, 7, 12],
    metric: ({ joinedAt, now }) => toWholeYearsSince(joinedAt, now),
  },
  {
    id: 'countdown',
    category: 'secret',
    title: m.vip_achievement_countdown_title,
    description: m.vip_achievement_countdown_description,
    step: secretStep,
    thresholds: [1],
    metric: ({ history }) => countNewYearPlays(history),
    isSecret: true,
  },
  {
    id: 'leap-day',
    category: 'secret',
    title: m.vip_achievement_leap_day_title,
    description: m.vip_achievement_leap_day_description,
    step: secretStep,
    thresholds: [1],
    metric: ({ history }) => countLeapDayPlays(history),
    isSecret: true,
  },
  {
    id: 'groundhog-day',
    category: 'secret',
    title: m.vip_achievement_groundhog_day_title,
    description: m.vip_achievement_groundhog_day_description,
    step: secretStep,
    thresholds: [1],
    metric: ({ history }) => countSameDayMovieRewatches(history),
    isSecret: true,
  },
];

// Credits Roll counts every other public achievement, so its top tier is all
// of them and grows as the catalog does.
const otherPublicCount = trackedCatalog.filter(
  (definition) => !definition.isSecret,
).length;

const creditsRoll: VipAchievementDefinition = {
  id: 'credits-roll',
  category: 'legacy',
  title: m.vip_achievement_credits_roll_title,
  description: m.vip_achievement_credits_roll_description,
  step: (threshold) =>
    m.vip_achievement_credits_roll_step({ count: toCount(threshold) }),
  thresholds: [10, 20, otherPublicCount],
  metric: ({ earnedAchievements }) => earnedAchievements ?? 0,
  countsOthers: true,
};

/**
 * The tiered achievement catalog. Metrics read only from already-loaded client
 * data (see `VipAchievementMetricInput`) and are compared against ascending
 * tier thresholds. Adding an achievement is a single new entry; adding a tier
 * is one number; adding a category is one entry in `achievementCategories`.
 */
export const achievementCatalog: ReadonlyArray<VipAchievementDefinition> = [
  ...trackedCatalog,
  creditsRoll,
];
