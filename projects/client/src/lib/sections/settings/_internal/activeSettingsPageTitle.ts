import * as m from '$lib/features/i18n/messages.ts';
import { settingsPages } from './settingsPages.ts';

export function activeSettingsPageTitle(pathname: string): string {
  const match = settingsPages.find((page) =>
    page.nested ? pathname.startsWith(page.href) : pathname === page.href
  );

  return match?.label() ?? m.page_title_settings();
}
