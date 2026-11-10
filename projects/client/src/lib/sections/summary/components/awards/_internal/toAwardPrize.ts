import * as m from '$lib/features/i18n/messages.ts';
import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import { toAwardName } from './toAwardName.ts';

const PRIZES: Partial<Record<AwardCeremonyKey, () => string>> = {
  cannes: m.text_award_prize_cannes,
  venice: m.text_award_prize_venice,
  berlin: m.text_award_prize_berlin,
};

export function toAwardPrize(ceremony: AwardCeremonyKey): string {
  return PRIZES[ceremony]?.() ?? toAwardName({ ceremony, count: 1 });
}
