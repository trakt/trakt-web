import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { toVipVeteranTone } from './toVipVeteranTone.ts';
import type { VipVeteranRingTone } from './VipVeteranRingTone.ts';

export function toVipVeteranRingTone(
  veteran: VipVeteran | Nil,
): VipVeteranRingTone | null {
  if (!veteran?.title) return null;

  const tone = toVipVeteranTone(veteran.tier);
  if (tone === 'copper' || tone === 'silver' || tone === 'gold') return tone;
  return null;
}
