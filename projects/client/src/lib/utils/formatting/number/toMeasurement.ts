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
  meters: number,
  locale: string,
): string {
  const isMetric = detectRegionalMetricSystem();
  const selectedUnit = isMetric ? 'meter' : 'foot';
  const convertedValue = isMetric ? meters : metersToFeet(meters);

  const formatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: selectedUnit,
    unitDisplay: 'short',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(convertedValue);
}
