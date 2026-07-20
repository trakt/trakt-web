import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type {
  AvailableLanguage,
  AvailableLocale,
} from '$lib/features/i18n/index.ts';

const IMPERIAL_REGIONS = ['US', 'LR', 'MM'];

function detectRegionalMetricSystem(): boolean {
  const locale = navigator.language;
  const region = locale.split('-')[1]?.toUpperCase();

  return region ? !IMPERIAL_REGIONS.includes(region) : true;
}

function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function toMeasurement(
  value: number,
  locale: AvailableLocale | AvailableLanguage | string = 'en',
): string {
  const isMetric = detectRegionalMetricSystem();
  const selectedUnit = isMetric ? 'meter' : 'foot';
  const convertedValue = isMetric ? value : metersToFeet(value);

  const formatter = new Intl.NumberFormat(
    getIntlLocale(locale as AvailableLanguage),
    {
      style: 'unit',
      unit: selectedUnit,
      unitDisplay: 'short',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  return formatter.format(convertedValue);
}
