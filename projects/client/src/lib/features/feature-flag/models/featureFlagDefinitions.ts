import CommentIcon from '$lib/components/icons/CommentIcon.svelte';
import CoverImageIcon from '$lib/components/icons/CoverImageIcon.svelte';
import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import FastRewindIcon from '$lib/components/icons/FastRewindIcon.svelte';
import FavoriteIcon from '$lib/components/icons/FavoriteIcon.svelte';
import IdIcon from '$lib/components/icons/IdIcon.svelte';
import MusicNoteIcon from '$lib/components/icons/MusicNoteIcon.svelte';
import NoSpoilerIcon from '$lib/components/icons/NoSpoilerIcon.svelte';
import PeopleIcon from '$lib/components/icons/PeopleIcon.svelte';
import ReactionsIcon from '$lib/components/icons/ReactionsIcon.svelte';
import SmartListIcon from '$lib/components/icons/SmartListIcon.svelte';
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
  [FeatureFlag.SummaryHeaderAnchored]: {
    icon: IdIcon,
    title: () => m.preview_feature_title_summary_header_anchored(),
    addedAt: new Date('2026-08-06'),
    description: () => m.preview_feature_description_summary_header_anchored(),
    audience: 'director',
  },
  [FeatureFlag.SummaryHeaderMasthead]: {
    icon: CoverImageIcon,
    title: () => m.preview_feature_title_summary_header_masthead(),
    addedAt: new Date('2026-08-06'),
    description: () => m.preview_feature_description_summary_header_masthead(),
    audience: 'director',
  },
  [FeatureFlag.Reactions]: {
    icon: ReactionsIcon,
    title: () => m.preview_feature_title_reactions(),
    addedAt: new Date('2026-08-07'),
    description: () => m.preview_feature_description_reactions(),
    audience: 'director',
  },
  [FeatureFlag.ReactionForum]: {
    icon: CommentIcon,
    title: () => m.preview_feature_title_reaction_forum(),
    addedAt: new Date('2026-08-07'),
    description: () => m.preview_feature_description_reaction_forum(),
    audience: 'director',
  },
  [FeatureFlag.SummaryAwards]: {
    icon: SparkleStarIcon,
    title: () => m.preview_feature_title_summary_awards(),
    addedAt: new Date('2026-08-07'),
    description: () => m.preview_feature_description_summary_awards(),
    audience: 'director',
  },
  [FeatureFlag.ParentalGuide]: {
    icon: NoSpoilerIcon,
    title: () => m.option_text_certification_parental_guidance(),
    addedAt: new Date('2026-06-30'),
    description: () => m.preview_feature_description_parental_guide(),
    audience: 'director',
  },
};
