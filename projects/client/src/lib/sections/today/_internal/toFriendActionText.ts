import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toHumanClockTime } from '$lib/utils/formatting/date/toHumanClockTime.ts';
import { toRelativeHumanDay } from '$lib/utils/formatting/date/toRelativeHumanDay.ts';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';

function toActionTime(activityAt: Date, now: Date): string {
  const time = toHumanClockTime(activityAt, languageTag());

  if (getDayKey(activityAt) === getDayKey(now)) return time;

  return m.text_today_day_time({
    day: toRelativeHumanDay(now, activityAt, getLocale()),
    time,
  });
}

function toItemLabel(action: TodayFriendAction): string | null {
  if (action.episode) return m.text_season_episode_number(action.episode);
  if (action.season) {
    return m.text_season_number({ number: action.season.number });
  }
  return null;
}

function toWatchText(action: TodayFriendAction, time: string): string {
  if (action.episodeCount > 1) {
    return m.text_today_watched_episodes_at({
      count: action.episodeCount,
      time,
    });
  }

  if (!action.episode) return m.text_today_watched_at({ time });

  return m.text_today_watched_episode_at({
    episode: m.text_season_episode_number(action.episode),
    time,
  });
}

function toRatingText(action: TodayFriendAction, time: string): string {
  const item = toItemLabel(action);
  return item
    ? m.text_today_rated_item_at({ item, time })
    : m.text_today_rated_at({ time });
}

function toCommentText(action: TodayFriendAction, time: string): string {
  if (action.comment?.isReview) return m.text_today_reviewed_at({ time });

  const item = toItemLabel(action);
  return item
    ? m.text_today_commented_item_at({ item, time })
    : m.text_today_commented_at({ time });
}

export function toFriendActionText(
  action: TodayFriendAction,
  now = new Date(),
): string {
  const time = toActionTime(action.activityAt, now);

  switch (action.kind) {
    case 'watch':
      return toWatchText(action, time);
    case 'rating':
      return toRatingText(action, time);
    case 'comment':
      return toCommentText(action, time);
  }
}
