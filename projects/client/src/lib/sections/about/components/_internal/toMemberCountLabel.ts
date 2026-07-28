import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

/** Expects an already-coarsened value from `toAnnounceValue`. */
export function toMemberCountLabel(announceValue: number): string {
  return m.text_member_count_accessible({
    count: toHumanNumber(announceValue, getLocale()),
  });
}
