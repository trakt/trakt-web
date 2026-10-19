import {
  type VipUpsellSource,
  VipUpsellSourceSchema,
} from './models/VipUpsellSource.ts';

export function toVipUpsellSource(raw: string | Nil): VipUpsellSource {
  const result = VipUpsellSourceSchema.safeParse(raw);

  return result.success ? result.data : 'direct';
}
