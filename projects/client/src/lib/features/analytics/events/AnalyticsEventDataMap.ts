import type { Theme } from '$lib/features/theme/models/Theme.ts';
import type { SimpleRating } from '$lib/models/SimpleRating.ts';
import type { MediaVideoType } from '$lib/requests/models/MediaVideo.ts';
import type { UpNextType } from '$lib/sections/lists/progress/useUpNextExperiment.ts';
import { AnalyticsEvent } from './AnalyticsEvent.ts';

type ActionType = { action: 'add' | 'remove' };
type RatingType = { action: 'added' | 'changed'; rating: SimpleRating };
type FilterType = { id: string; action: 'set' | 'reset' };
type CheckInType = { type: 'episode' | 'movie' };
type FollowType = { action: 'follow' | 'unfollow' };
type ExtrasType = { slug: string; type: MediaVideoType };
type CommentType = { action: 'post' | 'reply' };

export type AnalyticsEventDataMap = {
  [AnalyticsEvent.EnterLite]: never;
  [AnalyticsEvent.LeaveLite]: never;
  [AnalyticsEvent.NitroExperiment]: { type: UpNextType };

  [AnalyticsEvent.Theme]: { theme: Theme };
  [AnalyticsEvent.Locale]: { locale: string };
  [AnalyticsEvent.Filter]: FilterType;

  [AnalyticsEvent.Drop]: never;
  [AnalyticsEvent.Restore]: never;
  [AnalyticsEvent.MarkAsWatched]: ActionType;
  [AnalyticsEvent.Watchlist]: ActionType;
  [AnalyticsEvent.List]: ActionType;
  [AnalyticsEvent.RemoveFromHistory]: never;
  [AnalyticsEvent.LikeComment]: ActionType;
  [AnalyticsEvent.AddComment]: CommentType;
  [AnalyticsEvent.Rate]: RatingType;
  [AnalyticsEvent.CheckIn]: CheckInType;
  [AnalyticsEvent.Extras]: ExtrasType;

  [AnalyticsEvent.Settings]: { settings: string };

  [AnalyticsEvent.Follow]: FollowType;

  [AnalyticsEvent.ListRename]: never;
};
