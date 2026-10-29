import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import FastRewindIcon from '$lib/components/icons/FastRewindIcon.svelte';
import FlagIcon from '$lib/components/icons/FlagIcon.svelte';
import HourglassIcon from '$lib/components/icons/HourglassIcon.svelte';
import MusicNoteIcon from '$lib/components/icons/MusicNoteIcon.svelte';
import SparkleIcon from '$lib/components/icons/SparkleIcon.svelte';
import SparkleStarIcon from '$lib/components/icons/SparkleStarIcon.svelte';
import { m } from '$lib/features/i18n/messages.ts';
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
  [FeatureFlag.ShowEnding]: {
    icon: FlagIcon,
    title: () => m.preview_feature_title_show_ending(),
    addedAt: new Date('2026-10-16'),
    description: () => m.preview_feature_description_show_ending(),
  },
  [FeatureFlag.SeasonRecap]: {
    icon: HourglassIcon,
    title: () => m.preview_feature_title_season_recap(),
    addedAt: new Date('2026-10-27'),
    description: () => m.preview_feature_description_season_recap(),
    audience: 'director',
  },
};
