import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { TodayPersonAction } from './TodayPersonAction.ts';

export type TodayPersonGroup = Readonly<{
  key: string;
  user: UserProfile;
  actions: ReadonlyArray<TodayPersonAction>;
  latestAt: Date;
}>;
