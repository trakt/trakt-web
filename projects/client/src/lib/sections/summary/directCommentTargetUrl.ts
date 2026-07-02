import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import type { DirectCommentTarget } from '$lib/requests/models/DirectCommentTarget.ts';
import { SummaryDrawers } from '$lib/sections/summary/SummaryDrawers.ts';
import { COMMENT_ID_PARAM } from '$lib/sections/summary/constants.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type DirectCommentTargetUrlParams = {
  commentId: number;
  target: DirectCommentTarget;
};

export function directCommentTargetUrl(
  { commentId, target }: DirectCommentTargetUrlParams,
): string {
  const params = {
    [DRAWER_VIEW_PARAM]: SummaryDrawers.Review,
    [COMMENT_ID_PARAM]: commentId,
  };

  switch (target.type) {
    case 'movie':
      return UrlBuilder.movie(target.slug, params);
    case 'show':
      return UrlBuilder.show(target.slug, params);
    case 'season':
      return UrlBuilder.show(target.slug, {
        ...params,
        season: target.season,
      });
    case 'episode':
      return UrlBuilder.show(target.slug, {
        ...params,
        [DRAWER_VIEW_PARAM]: SummaryDrawers.Episode,
        season: target.season,
        episode: target.episode,
      });
    case 'list':
      return UrlBuilder.users(target.user).lists(target.list);
  }
}
