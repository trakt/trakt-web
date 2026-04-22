import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum DashboardDrawers {
  WeeklyPulse = 'weekly-pulse',
  Streak = 'streak',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case DashboardDrawers.WeeklyPulse:
      return DashboardDrawers.WeeklyPulse;
    case DashboardDrawers.Streak:
      return DashboardDrawers.Streak;
    default:
      return null;
  }
}

export function dashboardDrawerNavigation(
  searchParams?: URLSearchParams,
) {
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));

  return {
    drawer,
    ...drawerNavigation<DashboardDrawers>(),
  };
}
