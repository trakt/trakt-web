import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import { toOrdinal } from '$lib/utils/formatting/number/toOrdinal.ts';

export function toAwardEdition(ceremony: AwardEntry['ceremony']): string {
  if (ceremony.edition == null) return ceremony.name;

  return m.text_award_edition({
    edition: toOrdinal(ceremony.edition, getLocale()),
    ceremony: ceremony.name,
  });
}
