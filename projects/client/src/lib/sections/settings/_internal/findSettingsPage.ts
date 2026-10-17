import { settingsPages } from './settingsPages.ts';

export function findSettingsPage(pathname: string) {
  return settingsPages.find((page) => {
    const href = page.hubHref ?? page.href;
    return page.nested ? pathname.startsWith(href) : pathname === href;
  });
}
