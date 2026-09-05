import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
import CoverImageIcon from '$lib/components/icons/CoverImageIcon.svelte';
import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
import FastRewindIcon from '$lib/components/icons/FastRewindIcon.svelte';
import FavoriteIcon from '$lib/components/icons/FavoriteIcon.svelte';
import ListIcon from '$lib/components/icons/mobile/ListIcon.svelte';
import MusicNoteIcon from '$lib/components/icons/MusicNoteIcon.svelte';
import NoSpoilerIcon from '$lib/components/icons/NoSpoilerIcon.svelte';
import PeopleIcon from '$lib/components/icons/PeopleIcon.svelte';
import SmartListIcon from '$lib/components/icons/SmartListIcon.svelte';
import SparkleIcon from '$lib/components/icons/SparkleIcon.svelte';
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
  [FeatureFlag.ScopedFavorites]: {
    icon: FavoriteIcon,
    title: () => m.preview_feature_title_scoped_favorites(),
    addedAt: new Date('2026-06-11'),
    description: () => m.preview_feature_description_scoped_favorites(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.profile.favorites('me'),
        m.preview_feature_title_scoped_favorites(),
      ),
  },
  [FeatureFlag.UpNextSmartSort]: {
    icon: SmartListIcon,
    title: () => m.preview_feature_title_up_next_smart_sort(),
    addedAt: new Date('2026-07-09'),
    description: () => m.preview_feature_description_up_next_smart_sort(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.progress('me', { sort_by: 'smart' }),
        m.preview_feature_title_up_next_smart_sort(),
      ),
  },
  [FeatureFlag.Rewatching]: {
    icon: FastRewindIcon,
    title: () => m.preview_feature_title_rewatch(),
    addedAt: new Date('2026-06-19'),
    description: () => m.preview_feature_description_rewatch(),
  },
  [FeatureFlag.Leaderboard]: {
    icon: PeopleIcon,
    title: () => m.preview_feature_title_leaderboard(),
    addedAt: new Date('2026-07-09'),
    description: () => m.preview_feature_description_leaderboard(),
  },
  [FeatureFlag.Soundtrack]: {
    icon: MusicNoteIcon,
    title: () => m.preview_feature_title_soundtrack(),
    addedAt: new Date('2026-08-03'),
    description: () => m.preview_feature_description_soundtrack(),
  },
  [FeatureFlag.ListCounts]: {
    icon: ListIcon,
    title: () => m.preview_feature_title_list_counts(),
    addedAt: new Date('2026-08-21'),
    description: () => m.preview_feature_description_list_counts(),
  },
  [FeatureFlag.ReviewerStats]: {
    icon: EyeIcon,
    title: () => m.preview_feature_title_reviewer_stats(),
    addedAt: new Date('2026-08-22'),
    description: () => m.preview_feature_description_reviewer_stats(),
  },
  [FeatureFlag.GenrePicker]: {
    icon: SparkleIcon,
    title: () => m.preview_feature_title_genre_picker(),
    addedAt: new Date('2026-08-24'),
    description: () => m.preview_feature_description_genre_picker(),
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
  [FeatureFlag.ParentalGuide]: {
    icon: NoSpoilerIcon,
    title: () => m.option_text_certification_parental_guidance(),
    addedAt: new Date('2026-06-30'),
    description: () => m.preview_feature_description_parental_guide(),
    audience: 'director',
  },
  [FeatureFlag.ActionConfirmations]: {
    icon: CheckIcon,
    title: () => m.preview_feature_title_action_confirmations(),
    addedAt: new Date('2026-08-25'),
    description: () => m.preview_feature_description_action_confirmations(),
  },
};
