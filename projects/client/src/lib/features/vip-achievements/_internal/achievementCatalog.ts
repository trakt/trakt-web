import { m } from '$lib/features/i18n/messages.ts';
import { collectRatingValues } from './collectRatingValues.ts';
import {
  computeLongestStreak,
  countActiveDays,
  countDoubleFeatures,
  countMarathonDays,
  countNightOwlPlays,
} from './historyMetrics.ts';
import { isStreakFrozen } from './isStreakFrozen.ts';
import { toWholeYearsSince } from './toWholeYearsSince.ts';
import type { VipAchievementDefinition } from './VipAchievementDefinition.ts';

// Trakt rates in whole 5-star increments, stored as even values on the 1-10
// scale (1 star = 2 ... 5 stars = 10). "Full spectrum" means one rating at each
// of those five star levels; the odd values are never produced by the UI.
const WHOLE_STAR_SCORES = [2, 4, 6, 8, 10] as const;

/**
 * The tiered achievement catalog, grouped into archetype buckets. Metrics read
 * only from already-loaded client data (see `VipAchievementMetricInput`) and
 * are compared against ascending tier thresholds. Adding an achievement is a
 * single new entry; adding a tier is one number.
 */
export const achievementCatalog: ReadonlyArray<VipAchievementDefinition> = [
  // ── Volume & mileage ─────────────────────────────────────────────
  {
    id: 'time-spent-movies',
    bucket: 'volume',
    title: m.vip_achievement_time_spent_movies_title,
    description: m.vip_achievement_time_spent_movies_description,
    thresholds: [10_000, 50_000, 250_000],
    freezable: false,
    metric: ({ stats }) => stats?.movies.minutes ?? 0,
  },
  {
    id: 'time-spent-episodes',
    bucket: 'volume',
    title: m.vip_achievement_time_spent_episodes_title,
    description: m.vip_achievement_time_spent_episodes_description,
    thresholds: [25_000, 100_000, 500_000],
    freezable: false,
    metric: ({ stats }) => stats?.episodes.minutes ?? 0,
  },
  {
    id: 'century-club',
    bucket: 'volume',
    title: m.vip_achievement_century_club_title,
    description: m.vip_achievement_century_club_description,
    thresholds: [1_000, 5_000, 25_000, 100_000],
    freezable: false,
    metric: ({ stats }) => stats?.totalPlays ?? 0,
  },
  {
    id: 'active-logger',
    bucket: 'volume',
    title: m.vip_achievement_active_logger_title,
    description: m.vip_achievement_active_logger_description,
    thresholds: [50, 200, 500, 1_000],
    freezable: false,
    metric: ({ history }) => countActiveDays(history),
  },

  // ── Binge & velocity ─────────────────────────────────────────────
  {
    id: 'daily-streak',
    bucket: 'binge',
    title: m.vip_achievement_daily_streak_title,
    description: m.vip_achievement_daily_streak_description,
    thresholds: [7, 30, 100, 365],
    freezable: false,
    metric: ({ history }) => computeLongestStreak(history),
  },
  {
    id: 'night-owl',
    bucket: 'binge',
    title: m.vip_achievement_night_owl_title,
    description: m.vip_achievement_night_owl_description,
    thresholds: [5, 25, 100],
    freezable: false,
    metric: ({ history }) => countNightOwlPlays(history),
  },
  {
    id: 'marathon-fever',
    bucket: 'binge',
    title: m.vip_achievement_marathon_fever_title,
    description: m.vip_achievement_marathon_fever_description,
    thresholds: [1, 5, 20],
    freezable: false,
    metric: ({ history }) => countMarathonDays(history),
  },
  {
    id: 'show-completionist',
    bucket: 'binge',
    title: m.vip_achievement_show_completionist_title,
    description: m.vip_achievement_show_completionist_description,
    thresholds: [10, 50, 100, 250],
    freezable: false,
    metric: ({ stats }) => stats?.progress.finished ?? 0,
  },
  {
    id: 're-watcher',
    bucket: 'binge',
    title: m.vip_achievement_re_watcher_title,
    description: m.vip_achievement_re_watcher_description,
    thresholds: [10, 50, 200],
    freezable: false,
    metric: ({ stats }) =>
      stats
        ? (stats.movies.plays - stats.movies.watched) +
          (stats.episodes.plays - stats.episodes.watched)
        : 0,
  },

  // ── Ratings & reviews ────────────────────────────────────────────
  {
    id: 'perfect-ten',
    bucket: 'ratings',
    title: m.vip_achievement_perfect_ten_title,
    description: m.vip_achievement_perfect_ten_description,
    thresholds: [1, 10, 50, 100],
    freezable: false,
    metric: ({ ratings }) =>
      collectRatingValues(ratings).filter((rating) => rating === 10).length,
  },
  {
    id: 'harsh-critic',
    bucket: 'ratings',
    title: m.vip_achievement_harsh_critic_title,
    description: m.vip_achievement_harsh_critic_description,
    thresholds: [10, 50, 100],
    freezable: false,
    metric: ({ ratings }) =>
      collectRatingValues(ratings).filter((rating) => rating <= 4).length,
  },
  {
    id: 'rating-machine',
    bucket: 'ratings',
    title: m.vip_achievement_rating_machine_title,
    description: m.vip_achievement_rating_machine_description,
    thresholds: [100, 500, 2_500, 10_000],
    freezable: false,
    metric: ({ ratings }) => collectRatingValues(ratings).length,
  },
  {
    id: 'scribe',
    bucket: 'ratings',
    title: m.vip_achievement_scribe_title,
    description: m.vip_achievement_scribe_description,
    thresholds: [5, 25, 100, 250],
    freezable: false,
    metric: ({ stats }) =>
      stats
        ? stats.movies.comments + stats.shows.comments +
          stats.seasons.comments + stats.episodes.comments
        : 0,
  },
  {
    id: 'balanced-critic',
    bucket: 'ratings',
    title: m.vip_achievement_balanced_critic_title,
    description: m.vip_achievement_balanced_critic_description,
    thresholds: [1],
    freezable: false,
    metric: ({ ratings }) => {
      const scores = new Set(collectRatingValues(ratings));
      return WHOLE_STAR_SCORES.every((score) => scores.has(score)) ? 1 : 0;
    },
  },

  // ── Timing ───────────────────────────────────────────────────────
  {
    id: 'double-feature',
    bucket: 'timing',
    title: m.vip_achievement_double_feature_title,
    description: m.vip_achievement_double_feature_description,
    thresholds: [1, 5, 10, 25],
    freezable: false,
    metric: ({ history }) => countDoubleFeatures(history),
  },

  // ── Curation & limits ────────────────────────────────────────────
  {
    id: 'list-maker',
    bucket: 'curation',
    title: m.vip_achievement_list_maker_title,
    description: m.vip_achievement_list_maker_description,
    thresholds: [3, 10, 25],
    freezable: false,
    metric: ({ stats }) => stats?.lists ?? 0,
  },
  {
    id: 'vault-keeper',
    bucket: 'curation',
    title: m.vip_achievement_vault_keeper_title,
    description: m.vip_achievement_vault_keeper_description,
    thresholds: [100, 500, 2_500],
    freezable: false,
    metric: ({ limits }) => limits?.totalListItems.current ?? 0,
  },
  {
    id: 'vip-limit-breaker',
    bucket: 'curation',
    title: m.vip_achievement_vip_limit_breaker_title,
    description: m.vip_achievement_vip_limit_breaker_description,
    thresholds: [1],
    freezable: false,
    metric: ({ limits }) =>
      limits &&
        Object.values(limits).some((limit) => limit.current > limit.free)
        ? 1
        : 0,
  },
  {
    id: 'plex-archivist',
    bucket: 'curation',
    title: m.vip_achievement_plex_archivist_title,
    description: m.vip_achievement_plex_archivist_description,
    thresholds: [1_000, 5_000, 20_000],
    freezable: false,
    metric: ({ plexLibrary }) =>
      plexLibrary
        ? plexLibrary.movieIds.length + plexLibrary.showIds.length +
          plexLibrary.episodeIds.length
        : 0,
  },

  // ── VIP prestige ─────────────────────────────────────────────────
  {
    id: 'vip-loyalty',
    bucket: 'prestige',
    title: m.vip_achievement_vip_loyalty_title,
    description: m.vip_achievement_vip_loyalty_description,
    thresholds: [2, 5, 10],
    freezable: true,
    metric: ({ subscription }) => subscription?.vipYears ?? 0,
  },
  {
    id: 'trakt-veteran',
    bucket: 'prestige',
    title: m.vip_achievement_trakt_veteran_title,
    description: m.vip_achievement_trakt_veteran_description,
    thresholds: [3, 7, 12],
    freezable: false,
    metric: ({ profile, now }) => toWholeYearsSince(profile?.joinedAt, now),
  },
  {
    id: 'life-backer',
    bucket: 'prestige',
    title: m.vip_achievement_life_backer_title,
    description: m.vip_achievement_life_backer_description,
    thresholds: [1],
    freezable: false,
    metric: ({ subscription }) => (subscription?.type === 'life' ? 1 : 0),
  },
  {
    id: 'phoenix-rescue',
    bucket: 'prestige',
    title: m.vip_achievement_phoenix_rescue_title,
    description: m.vip_achievement_phoenix_rescue_description,
    thresholds: [1],
    freezable: false,
    metric: ({ subscription, now }) =>
      isStreakFrozen({ expiresAt: subscription?.expiresAt ?? null, now })
        ? 1
        : 0,
  },
  {
    id: 'director-flair',
    bucket: 'prestige',
    title: m.vip_achievement_director_flair_title,
    description: m.vip_achievement_director_flair_description,
    thresholds: [1],
    freezable: false,
    metric: ({ profile }) => (profile?.isDirector ? 1 : 0),
  },
];
