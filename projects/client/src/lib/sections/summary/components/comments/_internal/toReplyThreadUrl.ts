import type { DirectCommentTarget } from '$lib/requests/models/DirectCommentTarget.ts';
import { directCommentTargetUrl } from '$lib/sections/summary/directCommentTargetUrl.ts';
import type { CommentsProps } from '../CommentsProps.ts';

type ToReplyThreadUrlParams = { parentId: number } & CommentsProps;

function toDirectCommentTarget({
  media,
  ...props
}: CommentsProps): DirectCommentTarget {
  switch (props.type) {
    case 'episode':
      return {
        type: 'episode',
        slug: media.slug,
        season: props.season,
        episode: props.episode,
      };
    case 'season':
      return { type: 'season', slug: media.slug, season: props.season };
    default:
      return { type: props.type, slug: media.slug };
  }
}

export function toReplyThreadUrl({
  parentId,
  ...props
}: ToReplyThreadUrlParams) {
  return directCommentTargetUrl({
    commentId: parentId,
    target: toDirectCommentTarget(props),
  });
}
