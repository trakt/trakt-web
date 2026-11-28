import type { TodayMedia } from './models/TodayMedia.ts';

export type TodayPosterDetailsProps = {
  media: TodayMedia;
  kicker?: string | null;
  onOpenMedia?: () => void;
};
