type BasePromotion = {
  id: string;
  end: Date;
  start: Date;
} & AudienceProps;

export type PromotionBanner = BasePromotion & { type: 'promotion' };
export type MessageBanner = BasePromotion & {
  type: 'message';
  message: string;
};

export type Promotion = PromotionBanner | MessageBanner;
