import type { Theme } from '$lib/features/theme/models/Theme.ts';
import type { UpNextType } from '$lib/sections/lists/progress/useUpNextExperiment.ts';
import { AnalyticsEvent } from './AnalyticsEvent.ts';

type ActionType = { action: 'add' | 'remove' };

export type AnalyticsEventDataMap = {
  [AnalyticsEvent.EnterLite]: never;
  [AnalyticsEvent.LeaveLite]: never;
  [AnalyticsEvent.NitroExperiment]: { type: UpNextType };

  [AnalyticsEvent.Theme]: { theme: Theme };
  [AnalyticsEvent.Locale]: { locale: string };

  [AnalyticsEvent.Drop]: never;
  [AnalyticsEvent.Restore]: never;
  [AnalyticsEvent.MarkAsWatched]: ActionType;
  [AnalyticsEvent.Watchlist]: ActionType;
  [AnalyticsEvent.RemoveFromHistory]: never;
};
