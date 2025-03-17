import type { LikeCommentButtonIntl } from '$lib/components/buttons/like-comment/LikeCommentButtonIntl.ts';

export type LikeCommentButtonProps = {
  style: 'action' | 'normal' | 'dropdown-item';
  size: 'normal' | 'small';
  onLike: () => void;
  onUnlike: () => void;
  isLiked: boolean;
  isLiking: boolean;
  likeCount: number;
  i18n?: LikeCommentButtonIntl;
};
