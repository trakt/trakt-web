import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { activeSettingsPageTitle } from './_internal/activeSettingsPageTitle.ts';
import { settingsPages } from './_internal/settingsPages.ts';

type SettingsNavbarHeader = {
  title: string;
  back?: {
    href: string;
    label: string;
  };
};

/**
 * Resolves the drill-down parent for a settings pathname: nested sub-pages step
 * back to their section root, section roots step back to the hub.
 */
function backHrefFor(pathname: string): string {
  const hubHref = UrlBuilder.settings.general();

  const match = settingsPages.find((page) => {
    const href = page.hubHref ?? page.href;
    return page.nested ? pathname.startsWith(href) : pathname === href;
  });

  if (!match) {
    return hubHref;
  }

  const sectionHref = match.hubHref ?? match.href;
  return pathname === sectionHref ? hubHref : sectionHref;
}

/**
 * Navbar header for the settings section. On compact viewports the drilled-down
 * pages surface the active page title with a back affordance to the parent; the
 * hub itself and the desktop layout keep the plain "Settings" title.
 */
export function settingsNavbarHeader(
  { pathname, isCompact }: { pathname: string; isCompact: boolean },
): SettingsNavbarHeader {
  const hubHref = UrlBuilder.settings.general();

  if (!isCompact || pathname === hubHref) {
    return { title: m.page_title_settings() };
  }

  const backHref = backHrefFor(pathname);

  return {
    title: activeSettingsPageTitle(pathname),
    back: {
      href: backHref,
      label: activeSettingsPageTitle(backHref),
    },
  };
}
