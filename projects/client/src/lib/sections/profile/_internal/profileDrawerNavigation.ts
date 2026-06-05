import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

const commentIdParam = 'comment_id';

export enum ProfileDrawers {
  Activity = 'activity',
  ScreenTime = 'screen-time',
  Match = 'match',
}

const profileDrawerParams = {
  [ProfileDrawers.Activity]: { [commentIdParam]: '' },
} satisfies Partial<Record<ProfileDrawers, Record<string, string>>>;

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case ProfileDrawers.Activity:
      return ProfileDrawers.Activity;
    case ProfileDrawers.ScreenTime:
      return ProfileDrawers.ScreenTime;
    case ProfileDrawers.Match:
      return ProfileDrawers.Match;
    default:
      return null;
  }
}

export function profileDrawerNavigation(searchParams?: URLSearchParams) {
  const { buildDrawerLink, close } = drawerNavigation(profileDrawerParams);
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));
  const commentId = searchParams?.get(commentIdParam);
  const sourceCommentId = commentId != null ? Number(commentId) : undefined;

  return {
    drawer,
    sourceCommentId,
    close,
    buildDrawerLink: (id?: number) =>
      buildDrawerLink(
        ProfileDrawers.Activity,
        id != null ? { [commentIdParam]: String(id) } : undefined,
      ),
    buildScreenTimeDrawerLink: () => buildDrawerLink(ProfileDrawers.ScreenTime),
    buildMatchDrawerLink: () => buildDrawerLink(ProfileDrawers.Match),
  };
}
