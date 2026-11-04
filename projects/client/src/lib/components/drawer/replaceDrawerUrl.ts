import { goto } from '$app/navigation';
import { page } from '$app/state';
import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerHistoryTrap } from './_internal/drawerHistoryTrap.ts';

type ReplaceDrawerUrlOptions = {
  keepFocus?: boolean;
  noScroll?: boolean;
};

const keepsOpenDrawer = (target: URL) =>
  target.pathname === page.url.pathname &&
  target.searchParams.get(DRAWER_VIEW_PARAM) ===
    page.url.searchParams.get(DRAWER_VIEW_PARAM);

export function replaceDrawerUrl(
  url: string | URL,
  options: ReplaceDrawerUrlOptions = {},
) {
  const replace = (state?: App.PageState) =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { noScroll: true, ...options, replaceState: true, state });

  if (!drawerHistoryTrap.isTrapped()) return replace();

  const target = new URL(url, page.url);
  if (!keepsOpenDrawer(target)) {
    return drawerHistoryTrap.release().then(() => replace());
  }

  drawerHistoryTrap.markOwnNavigation(target);
  return replace(page.state);
}
