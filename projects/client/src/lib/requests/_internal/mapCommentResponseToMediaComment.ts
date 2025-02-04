import { DEFAULT_AVATAR } from '$lib/utils/constants';
import type { CommentResponse } from '@trakt/api';
import type { MediaComment } from '../models/MediaComment';

export function mapCommentResponseToMediaComment(
  commentResponse: CommentResponse,
): MediaComment {
  return {
    id: commentResponse.id,
    parentId: commentResponse.parent_id,
    createdAt: new Date(commentResponse.created_at),
    updatedAt: new Date(commentResponse.updated_at),
    comment: commentResponse.comment,
    isSpoiler: commentResponse.spoiler,
    isReview: commentResponse.review,
    replyCount: commentResponse.replies,
    likeCount: commentResponse.likes,
    user: {
      userName: commentResponse.user.username,
      isVip: commentResponse.user.vip || commentResponse.user.vip_ep,
      slug: commentResponse.user.ids.slug,
      avatar: {
        url: commentResponse.user.images?.avatar.full ?? DEFAULT_AVATAR,
      },
      stats: {
        rating: commentResponse.user_stats.rating,
        playCount: commentResponse.user_stats.play_count,
        completedCount: commentResponse.user_stats.completed_count,
      },
    },
  };
}
