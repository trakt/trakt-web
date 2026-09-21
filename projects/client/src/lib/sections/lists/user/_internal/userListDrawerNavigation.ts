import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum UserListDrawers {
  FeaturedPeople = 'featured-people',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case UserListDrawers.FeaturedPeople:
      return UserListDrawers.FeaturedPeople;
    default:
      return null;
  }
}

export function userListDrawerNavigation(
  searchParams?: URLSearchParams,
) {
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));

  return {
    drawer,
    ...drawerNavigation<UserListDrawers>(),
  };
}
