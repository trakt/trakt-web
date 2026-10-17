import * as m from '$lib/features/i18n/messages.ts';
import { findSettingsPage } from './findSettingsPage.ts';

export function activeSettingsPageTitle(pathname: string): string {
  return findSettingsPage(pathname)?.label() ?? m.page_title_settings();
}
