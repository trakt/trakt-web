import { getIntlLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';

export function toPickedLine(titles: ReadonlyArray<string>): string {
  const list = new Intl.ListFormat(getIntlLocale(languageTag()), {
    type: 'conjunction',
  }).format(titles);

  return m.text_mixtape_based_on({ titles: list });
}
