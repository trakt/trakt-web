import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';

type ToHumanPlanTermProps = {
  months: number;
  locale: AvailableLanguage;
};

const MONTHS_IN_YEAR = 12;

export function toHumanPlanTerm({ months, locale }: ToHumanPlanTermProps) {
  const isWholeYears = months % MONTHS_IN_YEAR === 0;

  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'unit',
    unit: isWholeYears ? 'year' : 'month',
    unitDisplay: 'long',
  }).format(isWholeYears ? months / MONTHS_IN_YEAR : months);
}
