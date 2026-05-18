import type { DatePart } from '$lib/models/DatePart.ts';

type BaseConfig = {
  id: string;
  start: DatePart;
  end: DatePart;
  type: 'promotion' | 'message';
} & AudienceProps;

export type PromotionConfig = {
  type: 'promotion';
} & BaseConfig;

export type MessageBannerConfig = {
  message: string;
  type: 'message';
} & BaseConfig;
