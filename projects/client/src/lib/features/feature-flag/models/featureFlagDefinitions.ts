import BrainIcon from '$lib/components/icons/BrainIcon.svelte';
import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
import EditModeIcon from '$lib/components/icons/EditModeIcon.svelte';
import FavoriteIcon from '$lib/components/icons/FavoriteIcon.svelte';
import NoSpoilerIcon from '$lib/components/icons/NoSpoilerIcon.svelte';
import PlexLibraryIcon from '$lib/components/icons/PlexLibraryIcon.svelte';
import SocialIcon from '$lib/components/icons/SocialIcon.svelte';
import TrackIcon from '$lib/components/icons/TrackIcon.svelte';
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
  description?: (() => string | null) | null;
  featureLink?: (() => FeatureFlagLink | null) | null;
  audience?: 'director' | 'vip';
};

type FeatureFlagDefinitions = Readonly<
  Record<FeatureFlag, FeatureFlagDefinition>
>;

const currentDate = () => new Date();

const currentYear = () => currentDate().getFullYear();

const currentMonth = () => currentDate().getMonth() + 1;

const openFeatureLink = (href: string, title: string): FeatureFlagLink => ({
  href,
  label: () => m.link_label_open_preview_feature({ title }),
});

export const featureFlagDefinitions: FeatureFlagDefinitions = {
  [FeatureFlag.YearInReview]: {
    icon: CalendarIcon,
    title: () => m.preview_feature_title_year_in_review(),
    description: () => m.preview_feature_description_year_in_review(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.users('me').yearToDate(currentYear()),
        m.preview_feature_title_year_in_review(),
      ),
  },
  [FeatureFlag.MonthInReview]: {
    icon: CalendarIcon,
    title: () => m.preview_feature_title_month_in_review(),
    description: () => m.preview_feature_description_month_in_review(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.users('me').monthInReview(currentYear(), currentMonth()),
        m.preview_feature_title_month_in_review(),
      ),
  },
  [FeatureFlag.EditMode]: {
    icon: EditModeIcon,
    title: () => m.preview_feature_title_edit_mode(),
    description: () => m.preview_feature_description_edit_mode(),
  },
  [FeatureFlag.StreamingServices]: {
    icon: TrackIcon,
    title: () => m.preview_feature_title_streaming_sync(),
    description: () => m.preview_feature_description_streaming_sync(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.settings.streamingServices(),
        m.preview_feature_title_streaming_sync(),
      ),
  },
  [FeatureFlag.ScopedFavorites]: {
    icon: FavoriteIcon,
    title: () => m.preview_feature_title_scoped_favorites(),
    description: () => m.preview_feature_description_scoped_favorites(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.profile.favorites('me'),
        m.preview_feature_title_scoped_favorites(),
      ),
  },
  [FeatureFlag.SocialActivities]: {
    icon: SocialIcon,
    title: () => m.preview_feature_title_social_activities(),
    description: () => m.preview_feature_description_social_activities(),
  },
  [FeatureFlag.PlexSync]: {
    icon: PlexLibraryIcon,
    title: () => m.preview_feature_title_plex_sync(),
    description: () => m.preview_feature_description_plex_sync(),
    featureLink: () =>
      openFeatureLink(
        UrlBuilder.settings.plex(),
        m.preview_feature_title_plex_sync(),
      ),
  },
  [FeatureFlag.SmartRelated]: {
    icon: BrainIcon,
    title: () => m.preview_feature_title_smart_related(),
    description: () => m.preview_feature_description_smart_related(),
    audience: 'director',
  },
  [FeatureFlag.ParentalGuide]: {
    icon: NoSpoilerIcon,
    title: () => m.option_text_certification_parental_guidance(),
    description: () => m.preview_feature_description_parental_guide(),
    audience: 'director',
  },
};
