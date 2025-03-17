export type LikeCommentButtonMeta = {
  isLiked: boolean;
  likeCount: number;
};

export type LikeCommentButtonIntl = {
  label: (meta: LikeCommentButtonMeta) => string;
  text: (meta: LikeCommentButtonMeta) => string;
};
