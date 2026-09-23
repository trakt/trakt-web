import { describe, expect, it } from 'vitest';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { activeSettingsPageTitle } from './_internal/activeSettingsPageTitle.ts';
import { settingsNavbarHeader } from './settingsNavbarHeader.ts';

describe('util: settingsNavbarHeader', () => {
  it('should not surface a back affordance on non-compact viewports', () => {
    const header = settingsNavbarHeader({
      pathname: UrlBuilder.settings.generalDetail(),
      isCompact: false,
    });

    expect(header.back).toBeUndefined();
  });

  it('should not surface a back affordance on the hub', () => {
    const header = settingsNavbarHeader({
      pathname: UrlBuilder.settings.general(),
      isCompact: true,
    });

    expect(header.back).toBeUndefined();
  });

  it('should point section roots back to the hub', () => {
    const header = settingsNavbarHeader({
      pathname: UrlBuilder.settings.data(),
      isCompact: true,
    });

    expect(header.back?.href).toBe(UrlBuilder.settings.general());
  });

  it('should point connected apps back to the settings hub', () => {
    const header = settingsNavbarHeader({
      pathname: UrlBuilder.settings.appsConnected(),
      isCompact: true,
    });

    expect(header.back?.href).toBe(UrlBuilder.settings.general());
  });

  it('should label the back affordance with its destination', () => {
    const header = settingsNavbarHeader({
      pathname: UrlBuilder.settings.appsConnected(),
      isCompact: true,
    });

    expect(header.back?.label).toBe(
      activeSettingsPageTitle(UrlBuilder.settings.general()),
    );
  });
});
