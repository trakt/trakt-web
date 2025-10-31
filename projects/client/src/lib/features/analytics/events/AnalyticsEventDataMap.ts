import type { Theme } from '$lib/features/theme/models/Theme.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { MediaVideoType } from '$lib/requests/models/MediaVideo.ts';
import type { SearchMode } from '$lib/requests/queries/search/models/SearchMode.ts';
import type { CtaType } from '$lib/sections/lists/components/cta/models/Cta.ts';
import type { DiscoverMode } from '../../discover/models/DiscoverMode.ts';
import { AnalyticsEvent } from './AnalyticsEvent.ts';

type SourceType = { source: string };

type ActionType = { action: 'add' | 'remove' };
type RatingType = { action: 'added' | 'changed'; rating: number };
type FilterType = { id: string; action: 'set' | 'reset' };
type FiltersType = { action: 'save' | 'reset' };
type CheckInType = { type: 'episode' | 'movie'; action: 'start' | 'stop' };
type FollowType = { action: 'follow' | 'unfollow' };
type ExtrasType = { slug: string; type: MediaVideoType };
type CommentType = { action: 'post' | 'reply' };
type ReactionType = { action: 'add' | 'remove'; type: 'comment' };
type CalendarType = { action: 'reset' | 'next' | 'previous' };
type StreamOnType = SourceType;
type CtaDataType = { type: CtaType };
type DrilldownType = SourceType & { type?: string };
type SearchType = { mode: SearchMode };
type ShareType = DrilldownType;
type CoverImageType = { type: ExtendedMediaType };
type DiscoverType = SourceType & { mode: DiscoverMode };
type SeasonalFilterType = { id: string; state: 'enabled' | 'disabled' };

export type AnalyticsEventDataMap = {
  [AnalyticsEvent.EnterLite]: never;
  [AnalyticsEvent.Cta]: CtaDataType;
  [AnalyticsEvent.DiscoverMode]: DiscoverType;

  [AnalyticsEvent.Theme]: { theme: Theme };
  [AnalyticsEvent.Locale]: { locale: string };
  [AnalyticsEvent.Link]: { target: string };
  [AnalyticsEvent.Filter]: FilterType;
  [AnalyticsEvent.Filters]: FiltersType;
  [AnalyticsEvent.Drilldown]: DrilldownType;
  [AnalyticsEvent.SummaryDrilldown]: DrilldownType;
  [AnalyticsEvent.Search]: SearchType;
  [AnalyticsEvent.Share]: ShareType;

  [AnalyticsEvent.Drop]: { type: MediaType };
  [AnalyticsEvent.Restore]: never;
  [AnalyticsEvent.MarkAsWatched]: ActionType;
  [AnalyticsEvent.Watchlist]: ActionType;
  [AnalyticsEvent.List]: ActionType;
  [AnalyticsEvent.RemoveFromHistory]: never;
  [AnalyticsEvent.React]: ReactionType;
  [AnalyticsEvent.AddComment]: CommentType;
  [AnalyticsEvent.DeleteComment]: never;
  [AnalyticsEvent.Rate]: RatingType;
  [AnalyticsEvent.CheckIn]: CheckInType;
  [AnalyticsEvent.Extras]: ExtrasType;
  [AnalyticsEvent.Trailer]: { slug: string };
  [AnalyticsEvent.StreamOn]: StreamOnType;

  [AnalyticsEvent.Settings]: { settings: string };
  [AnalyticsEvent.CoverImage]: CoverImageType;

  [AnalyticsEvent.Follow]: FollowType;

  [AnalyticsEvent.ListRename]: never;
  [AnalyticsEvent.ListDelete]: never;
  [AnalyticsEvent.ListCreate]: never;

  [AnalyticsEvent.CalendarPeriod]: CalendarType;

  [AnalyticsEvent.SeasonalFilter]: SeasonalFilterType;
};
