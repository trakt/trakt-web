import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import FastRewindIcon from '$lib/components/icons/FastRewindIcon.svelte';
import LaurelIcon from '$lib/components/icons/LaurelIcon.svelte';
import HourglassIcon from '$lib/components/icons/HourglassIcon.svelte';
import MatchIcon from '$lib/components/icons/MatchIcon.svelte';
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
    addedAt: new Date('2026-11-09'),
    description: () => m.preview_feature_description_vip_veteran(),
  },
  [FeatureFlag.SeasonRecap]: {
    icon: HourglassIcon,
    title: () => m.preview_feature_title_season_recap(),
    addedAt: new Date('2026-10-27'),
    description: () => m.preview_feature_description_season_recap(),
    audience: 'vip',
  },
  [FeatureFlag.PersonalizedRelated]: {
    icon: SparkleStarIcon,
    title: () => m.preview_feature_title_personalized_related(),
    addedAt: new Date('2026-11-02'),
    description: () => m.preview_feature_description_personalized_related(),
    audience: 'director',
  },
  [FeatureFlag.AnticipatedRecommendations]: {
    icon: HourglassIcon,
    title: () => m.preview_feature_title_anticipated_recommendations(),
    addedAt: new Date('2026-11-08'),
    description: () =>
      m.preview_feature_description_anticipated_recommendations(),
    audience: 'director',
  },
  [FeatureFlag.InsightsCard]: {
    icon: MatchIcon,
    title: () => m.preview_feature_title_insights_card(),
    addedAt: new Date('2026-11-08'),
    description: () => m.preview_feature_description_insights_card(),
    audience: 'director',
  },
  [FeatureFlag.Awards]: {
    icon: LaurelIcon,
    title: () => m.preview_feature_title_awards(),
    addedAt: new Date('2026-11-10'),
    description: () => m.preview_feature_description_awards(),
    audience: 'director',
  },
};
