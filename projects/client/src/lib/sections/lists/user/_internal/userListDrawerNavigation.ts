import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum UserListDrawers {
  Details = 'details',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case UserListDrawers.Details:
      return UserListDrawers.Details;
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
