import { goto } from '$app/navigation';
import { page } from '$app/state';
import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';

export function drawerNavigation<T extends string>() {
  const buildDrawerLink = (drawer: T) => {
    const url = new URL(page.url);
    url.searchParams.set(DRAWER_VIEW_PARAM, drawer);
    return url.toString();
  };

  const close = () => {
    const url = new URL(page.url);
    url.searchParams.delete(DRAWER_VIEW_PARAM);
    goto(url, { noScroll: true });
  };

  return {
    buildDrawerLink,
    close,
  };
}
