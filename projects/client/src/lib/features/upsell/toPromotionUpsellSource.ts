import type { Promotion } from '$lib/features/promotions/models/Promotion.ts';
import type { VipUpsellSource } from './models/VipUpsellSource.ts';

export function toPromotionUpsellSource({
  id,
}: Pick<Promotion, 'id'>): VipUpsellSource {
  return `promotion-${id}`;
}
