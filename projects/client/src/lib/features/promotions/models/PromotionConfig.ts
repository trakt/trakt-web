import type { DatePart } from '$lib/models/DatePart.ts';

export type PromotionConfig = {
  id: string;
  start: DatePart;
  end: DatePart;
} & AudienceProps;
