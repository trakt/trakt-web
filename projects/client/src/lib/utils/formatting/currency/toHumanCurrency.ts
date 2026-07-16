import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';

type ToHumanCurrencyProps = {
  price: number;
  currency: string;
  locale: AvailableLanguage;
};

export function toHumanCurrency({
  price,
  currency,
  locale,
}: ToHumanCurrencyProps): string {
  const hasDecimals = price % 1 !== 0;

  const inf = new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return inf.format(price);
}
