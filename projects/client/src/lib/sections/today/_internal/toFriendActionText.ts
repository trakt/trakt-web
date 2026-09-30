import * as m from '$lib/features/i18n/messages.ts';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';
import { toFriendActionTime } from './toFriendActionTime.ts';
import { toFriendItemLabel } from './toFriendItemLabel.ts';

function toWatchText(action: TodayFriendAction, time: string): string {
  if (action.episodeCount > 1) {
    return m.text_today_watched_episodes_at({
      count: action.episodeCount,
      time,
    });
  }

  const episode = action.episode ? toFriendItemLabel(action) : null;
  return episode
    ? m.text_today_watched_episode_at({ episode, time })
    : m.text_today_watched_at({ time });
}

function toRatingText(action: TodayFriendAction, time: string): string {
  const item = toFriendItemLabel(action);
  return item
    ? m.text_today_rated_item_at({ item, time })
    : m.text_today_rated_at({ time });
}

function toCommentText(action: TodayFriendAction, time: string): string {
  if (action.comment?.isReview) return m.text_today_reviewed_at({ time });

  const item = toFriendItemLabel(action);
  return item
    ? m.text_today_commented_item_at({ item, time })
    : m.text_today_commented_at({ time });
}

export function toFriendActionText(
  action: TodayFriendAction,
  now = new Date(),
): string {
  const time = toFriendActionTime(action.activityAt, now);

  switch (action.kind) {
    case 'watch':
      return toWatchText(action, time);
    case 'rating':
      return toRatingText(action, time);
    case 'comment':
      return toCommentText(action, time);
  }
}
