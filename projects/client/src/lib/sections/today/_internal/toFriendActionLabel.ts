import * as m from '$lib/features/i18n/messages.ts';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';
import { toFriendItemLabel } from './toFriendItemLabel.ts';

function toWatchLabel(action: TodayFriendAction): string {
  if (action.episodeCount > 1) {
    return m.text_today_watched_episodes({ count: action.episodeCount });
  }

  const episode = action.episode ? toFriendItemLabel(action) : null;
  return episode
    ? m.text_today_watched_episode({ episode })
    : m.text_today_watched();
}

function toRatingLabel(action: TodayFriendAction): string {
  const item = toFriendItemLabel(action);
  return item ? m.text_today_rated_item({ item }) : m.text_today_rated();
}

function toCommentLabel(action: TodayFriendAction): string {
  if (action.comment?.isReview) return m.text_today_reviewed();

  const item = toFriendItemLabel(action);
  return item
    ? m.text_today_commented_item({ item })
    : m.text_today_commented();
}

export function toFriendActionLabel(action: TodayFriendAction): string {
  switch (action.kind) {
    case 'watch':
      return toWatchLabel(action);
    case 'rating':
      return toRatingLabel(action);
    case 'comment':
      return toCommentLabel(action);
  }
}
