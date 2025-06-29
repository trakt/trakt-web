import * as m from '$lib/features/i18n/messages.ts';
import type {
  LikeCommentButtonIntl,
  LikeCommentButtonMeta,
} from './LikeCommentButtonIntl.ts';

export const LikeCommentButtonIntlProvider: LikeCommentButtonIntl = {
  label: ({ isLiked }: LikeCommentButtonMeta) =>
    isLiked ? m.button_label_unlike_comment() : m.button_label_like_comment(),
  text: ({ likeCount, isMobile }: LikeCommentButtonMeta) => {
    return isMobile ? `${likeCount}` : m.button_text_comment_likes({ count: likeCount });
  },
};
