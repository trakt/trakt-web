import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum SmartListDrawers {
  Recipe = 'recipe',
}

function mapToDrawer(value: string | Nil) {
  return value === SmartListDrawers.Recipe ? SmartListDrawers.Recipe : null;
}

export function smartListDrawerNavigation(searchParams?: URLSearchParams) {
  return {
    drawer: mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM)),
    ...drawerNavigation<SmartListDrawers>(),
  };
}
