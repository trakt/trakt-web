import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type SettingsPage = {
  href: string;
  label: () => string;
  nested?: boolean;
  flag?: FeatureFlag;
};

export const settingsPages: ReadonlyArray<SettingsPage> = [
  {
    href: UrlBuilder.settings.general(),
    label: m.link_text_general_settings,
  },
  {
    href: UrlBuilder.settings.data(),
    label: m.link_text_data_settings,
  },
  {
    href: UrlBuilder.settings.apps(),
    label: m.link_text_apps_settings,
    nested: true,
  },
  {
    href: UrlBuilder.settings.streamingServices(),
    label: m.link_text_streaming_sync_settings,
  },
  {
    href: UrlBuilder.settings.plex(),
    label: m.link_text_plex_settings,
    flag: FeatureFlag.PlexSync,
  },
  {
    href: UrlBuilder.settings.advanced(),
    label: m.link_text_advanced_settings,
  },
  {
    href: UrlBuilder.settings.preview(),
    label: m.link_text_preview_settings,
  },
];
