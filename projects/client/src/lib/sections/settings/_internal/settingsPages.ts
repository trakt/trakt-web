import CastIcon from '$lib/components/icons/CastIcon.svelte';
import GearIcon from '$lib/components/icons/GearIcon.svelte';
import LibraryIcon from '$lib/components/icons/LibraryIcon.svelte';
import PlexLibraryIcon from '$lib/components/icons/PlexLibraryIcon.svelte';
import PlugIcon from '$lib/components/icons/PlugIcon.svelte';
import ServerIcon from '$lib/components/icons/ServerIcon.svelte';
import SparkleIcon from '$lib/components/icons/SparkleIcon.svelte';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { Component } from 'svelte';

type SettingsPage = {
  href: string;
  label: () => string;
  icon: Component;
  nested?: boolean;
  flag?: FeatureFlag;
  /**
   * Destination for the mobile settings hub, when it differs from the desktop
   * sidebar `href`. General surfaces its account details on the hub itself, so
   * its drill-down row targets the standalone `/settings/general` route.
   */
  hubHref?: string;
};

export const settingsPages: ReadonlyArray<SettingsPage> = [
  {
    href: UrlBuilder.settings.general(),
    hubHref: UrlBuilder.settings.generalDetail(),
    label: m.link_text_general_settings,
    icon: GearIcon,
  },
  {
    href: UrlBuilder.settings.data(),
    label: m.link_text_data_settings,
    icon: LibraryIcon,
  },
  {
    href: UrlBuilder.settings.apps(),
    label: m.link_text_apps_settings,
    icon: PlugIcon,
    nested: true,
  },
  {
    href: UrlBuilder.settings.streamingServices(),
    label: m.link_text_streaming_sync_settings,
    icon: CastIcon,
  },
  {
    href: UrlBuilder.settings.plex(),
    label: m.link_text_plex_settings,
    icon: PlexLibraryIcon,
  },
  {
    href: UrlBuilder.settings.advanced(),
    label: m.link_text_advanced_settings,
    icon: ServerIcon,
  },
  {
    href: UrlBuilder.settings.preview(),
    label: m.link_text_preview_settings,
    icon: SparkleIcon,
  },
];
