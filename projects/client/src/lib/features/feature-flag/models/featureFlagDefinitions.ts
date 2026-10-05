import CoverImageIcon from '$lib/components/icons/CoverImageIcon.svelte';
import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import FastRewindIcon from '$lib/components/icons/FastRewindIcon.svelte';
import PlexLogo from '$lib/components/icons/PlexLogo.svelte';
import MusicNoteIcon from '$lib/components/icons/MusicNoteIcon.svelte';
import ReactionIcon from '$lib/components/icons/ReactionIcon.svelte';
import SparkleIcon from '$lib/components/icons/SparkleIcon.svelte';
import SparkleStarIcon from '$lib/components/icons/SparkleStarIcon.svelte';
import { m } from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { Component } from 'svelte';
import { FeatureFlag } from './FeatureFlag.ts';

type FeatureFlagLink = {
  href: string;
  label: () => string;
};

type FeatureFlagDefinition = {
  icon: Component;
  title: () => string;
  addedAt: Date;
  description?: (() => string | null) | null;
  featureLink?: (() => FeatureFlagLink | null) | null;
  audience?: 'director' | 'vip';
};

type FeatureFlagDefinitions = Readonly<
  Record<FeatureFlag, FeatureFlagDefinition>
>;

const openFeatureLink = (href: string, title: string): FeatureFlagLink => ({
  href,
  label: () => m.link_label_open_preview_feature({ title }),
});

export const featureFlagDefinitions: FeatureFlagDefinitions = {
  [FeatureFlag.EditMode]: {
    icon: EditModeIcon,
    title: () => m.preview_feature_title_edit_mode(),
    addedAt: new Date('2026-04-30'),
    description: () => m.preview_feature_description_edit_mode(),
  },
  [FeatureFlag.Rewatching]: {
    icon: FastRewindIcon,
    title: () => m.preview_feature_title_rewatch(),
    addedAt: new Date('2026-06-19'),
    description: () => m.preview_feature_description_rewatch(),
  },
  [FeatureFlag.Soundtrack]: {
    icon: MusicNoteIcon,
    title: () => m.preview_feature_title_soundtrack(),
    addedAt: new Date('2026-08-03'),
    description: () => m.preview_feature_description_soundtrack(),
  },
  [FeatureFlag.LargeScreenCards]: {
    icon: CoverImageIcon,
    title: () => m.preview_feature_title_large_screen_cards(),
    addedAt: new Date('2026-09-03'),
    description: () => m.preview_feature_description_large_screen_cards(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.trending(),
        m.preview_feature_title_large_screen_cards(),
      ),
  },
  [FeatureFlag.YearInReview2026]: {
    icon: SparkleIcon,
    title: () => m.preview_feature_title_year_in_review_2026(),
    addedAt: new Date('2026-09-29'),
    description: () => m.preview_feature_description_year_in_review_2026(),
    audience: 'director',
  },
  [FeatureFlag.VipVeteran]: {
    icon: SparkleStarIcon,
    title: () => m.preview_feature_title_vip_veteran(),
    addedAt: new Date('2026-10-02'),
    description: () => m.preview_feature_description_vip_veteran(),
    audience: 'director',
  },
  [FeatureFlag.Reactions]: {
    icon: ReactionIcon,
    title: () => m.preview_feature_title_reactions(),
    addedAt: new Date('2026-10-02'),
    description: () => m.preview_feature_description_reactions(),
  },
  [FeatureFlag.PlexSyncV2]: {
    icon: PlexLogo,
    title: () => m.preview_feature_title_plex_sync_v2(),
    addedAt: new Date('2026-10-05'),
    description: () => m.preview_feature_description_plex_sync_v2(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.settings.plex(),
        m.preview_feature_title_plex_sync_v2(),
      ),
    audience: 'director',
  },
};
