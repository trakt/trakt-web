import * as m from '$lib/features/i18n/messages.ts';
import type {
  LikeCommentButtonIntl,
  LikeCommentButtonMeta,
} from './LikeCommentButtonIntl.ts';

export const LikeCommentButtonIntlProvider: LikeCommentButtonIntl = {
  label: ({ isLiked }: LikeCommentButtonMeta) =>
    isLiked ? m.unlike_comment_label() : m.like_comment_label(),
  text: ({ likeCount }: LikeCommentButtonMeta) => {
    return m.comment_likes({ count: likeCount });
  },
};
