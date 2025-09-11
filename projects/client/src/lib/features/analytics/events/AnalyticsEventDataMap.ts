import type { Theme } from '$lib/features/theme/models/Theme.ts';
import type { SimpleRating } from '$lib/models/SimpleRating.ts';
import type { MediaVideoType } from '$lib/requests/models/MediaVideo.ts';
import type { Cta } from '$lib/sections/lists/components/cta/models/Cta.ts';
import { AnalyticsEvent } from './AnalyticsEvent.ts';

type ActionType = { action: 'add' | 'remove' };
type RatingType = { action: 'added' | 'changed'; rating: SimpleRating };
type FilterType = { id: string; action: 'set' | 'reset' };
type CheckInType = { type: 'episode' | 'movie'; action: 'start' | 'stop' };
type FollowType = { action: 'follow' | 'unfollow' };
type ExtrasType = { slug: string; type: MediaVideoType };
type CommentType = { action: 'post' | 'reply' };
type ReactionType = { action: 'add' | 'remove'; type: 'comment' };
type CalendarType = { action: 'reset' | 'next' | 'previous' };
type StreamOnType = { source: string };
type CtaType = { type: Cta };

export type AnalyticsEventDataMap = {
  [AnalyticsEvent.EnterLite]: never;
  [AnalyticsEvent.Cta]: CtaType;

  [AnalyticsEvent.Theme]: { theme: Theme };
  [AnalyticsEvent.Locale]: { locale: string };
  [AnalyticsEvent.Filter]: FilterType;

  [AnalyticsEvent.Drop]: never;
  [AnalyticsEvent.Restore]: never;
  [AnalyticsEvent.MarkAsWatched]: ActionType;
  [AnalyticsEvent.Watchlist]: ActionType;
  [AnalyticsEvent.List]: ActionType;
  [AnalyticsEvent.RemoveFromHistory]: never;
  [AnalyticsEvent.React]: ReactionType;
  [AnalyticsEvent.AddComment]: CommentType;
  [AnalyticsEvent.Rate]: RatingType;
  [AnalyticsEvent.CheckIn]: CheckInType;
  [AnalyticsEvent.Extras]: ExtrasType;
  [AnalyticsEvent.StreamOn]: StreamOnType;

  [AnalyticsEvent.Settings]: { settings: string };

  [AnalyticsEvent.Follow]: FollowType;

  [AnalyticsEvent.ListRename]: never;
  [AnalyticsEvent.ListDelete]: never;
  [AnalyticsEvent.ListCreate]: never;

  [AnalyticsEvent.CalendarPeriod]: CalendarType;
};
