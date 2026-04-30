import { goto } from '$app/navigation';
import { page } from '$app/state';
import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';

export function drawerNavigation<
  T extends string,
  P extends Partial<Record<T, Record<string, string>>> = Record<never, never>,
>(params?: P) {
  const cleanupKeys = params
    ? Object.values(params).flatMap((p) =>
      Object.keys(p as Record<string, string>)
    )
    : [];

  const buildDrawerLink = <D extends T>(
    drawer: D,
    ...[extraParams]: D extends keyof P ? [P[D]?] : []
  ) => {
    const url = new URL(page.url);
    url.searchParams.set(DRAWER_VIEW_PARAM, drawer);
    if (extraParams) {
      for (const [key, value] of Object.entries(extraParams)) {
        url.searchParams.set(key, value);
      }
    }
    return {
      href: url.toString(),
      noscroll: true,
      replacestate: true,
    };
  };

  const close = () => {
    const url = new URL(page.url);
    url.searchParams.delete(DRAWER_VIEW_PARAM);
    cleanupKeys.forEach((key) => url.searchParams.delete(key));
    goto(url, { noScroll: true, replaceState: true });
  };

  return {
    buildDrawerLink,
    close,
  };
}
