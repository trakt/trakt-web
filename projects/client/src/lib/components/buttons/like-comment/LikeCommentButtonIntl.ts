export type LikeCommentButtonMeta = {
  isLiked: boolean;
  likeCount: number;
  isMobile: boolean;
};

export type LikeCommentButtonIntl = {
  label: (meta: LikeCommentButtonMeta) => string;
  text: (meta: LikeCommentButtonMeta) => string;
};
