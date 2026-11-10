import {
  type AvailableLocale,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';

const ORDINALS: Partial<
  Record<Intl.LDMLPluralRule, (params: { count: number }) => string>
> = {
  one: m.text_ordinal_one,
  two: m.text_ordinal_two,
  few: m.text_ordinal_few,
};

export function toOrdinal(value: number, locale: AvailableLocale = 'en') {
  const category = new Intl.PluralRules(getIntlLocale(locale), {
    type: 'ordinal',
  }).select(value);

  return (ORDINALS[category] ?? m.text_ordinal_other)({ count: value });
}
