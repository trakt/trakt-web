import type { ActivityType } from '$lib/models/ActivityType.ts';
import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
import type { Snippet } from 'svelte';
import type { HistoryEntry } from '../../stores/models/HistoryEntry.ts';
import type { BaseItemProps } from '../models/BaseItemProps.ts';

export type ActivityItemProps = {
  activity: SocialActivity | HistoryEntry;
  activityAt: Date;
  badge?: Snippet;
  popupActions?: Snippet;
  source?: string;
  activityType: ActivityType;
  style?: BaseItemProps['style'];
};
