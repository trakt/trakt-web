import * as m from '$lib/features/i18n/messages.ts';

export function toNominationCount(count: number): string {
  return count === 1
    ? m.text_award_nomination_count_one({ count })
    : m.text_award_nomination_count_other({ count });
}
