import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import type { TodayMedia } from './TodayMedia.ts';

export type TodayForYouItem =
  | Readonly<{ key: string; type: 'up-next'; entry: UpNextEntry }>
  | Readonly<{ key: string; type: 'start-watching'; media: TodayMedia }>;
