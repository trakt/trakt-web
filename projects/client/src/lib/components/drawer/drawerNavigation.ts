import { goto } from '$app/navigation';
import { page } from '$app/state';
import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';

export function drawerNavigation<
  T extends string,
  P extends Partial<Record<T, Record<string, string>>> = Record<never, never>,
>(params?: P, options?: { persistentKeys?: readonly string[] }) {
  // Params a drawer may set when opening but must NOT strip when closing,
  // because they double as page-owned state (e.g. the active season tab).
  // Removing them on close would tear down the underlying page.
  const persistentKeys = new Set(options?.persistentKeys ?? []);
  const cleanupKeys = params
    ? Object.values(params)
      .flatMap((p) => (p ? Object.keys(p) : []))
      .filter((key) => !persistentKeys.has(key))
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
