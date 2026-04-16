import { goto } from '$app/navigation';
import { page } from '$app/state';

const VIEW_PARAM = 'view';

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
  const drawer = mapToDrawer(searchParams?.get(VIEW_PARAM));

  const buildDrawerLink = (drawer: DashboardDrawers) => {
    const url = new URL(page.url);
    url.searchParams.set(VIEW_PARAM, drawer);
    return url.toString();
  };

  const close = () => {
    const url = new URL(page.url);
    url.searchParams.delete(VIEW_PARAM);
    goto(url, { noScroll: true });
  };

  return {
    drawer,
    buildDrawerLink,
    close,
  };
}
