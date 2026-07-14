import * as m from '$lib/features/i18n/messages.ts';
import { settingsPages } from './settingsPages.ts';

export function activeSettingsPageTitle(pathname: string): string {
  const match = settingsPages.find((page) => {
    const href = page.hubHref ?? page.href;
    return page.nested ? pathname.startsWith(href) : pathname === href;
  });

  return match?.label() ?? m.page_title_settings();
}
