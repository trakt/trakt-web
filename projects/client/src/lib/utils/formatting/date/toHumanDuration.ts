import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';

export type Duration = {
  days: number;
  hours: number;
  minutes: number;
};

type DurationUnit = 'day' | 'hour';

type ToHumanDurationProps = {
  days?: number;
  hours?: number;
  minutes?: number;
  unitDisplay?: Intl.NumberFormatOptions['unitDisplay'];
  separator?: string;
  clampAt?: DurationUnit;
};

const FALLBACK_UNIT_SUFFIX = {
  day: 'd',
  hour: 'h',
  minute: 'm',
} as const;

type FormattedUnit = keyof typeof FALLBACK_UNIT_SUFFIX;

type CreateUnitFormatterProps = {
  locale: string;
  unit: FormattedUnit;
  unitDisplay: Intl.NumberFormatOptions['unitDisplay'];
};

function createUnitFormatter({
  locale,
  unit,
  unitDisplay,
}: CreateUnitFormatterProps): { format: (value: number) => string } {
  try {
    return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay });
  } catch {
    const decimal = new Intl.NumberFormat(locale);

    return {
      format: (value) =>
        `${decimal.format(value)}${FALLBACK_UNIT_SUFFIX[unit]}`,
    };
  }
}

export function toHumanDuration({
  days = 0,
  hours = 0,
  minutes = 0,
  unitDisplay = 'narrow',
  separator = ' ',
  clampAt,
}: ToHumanDurationProps, locale: AvailableLanguage = 'en') {
  const totalMinutes = minutes + (hours * 60) + (days * 24 * 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const getDuration = () => {
    // Show days only when clamping at day and we have at least one day
    if (clampAt === 'day' && totalDays >= 1) {
      return { days: totalDays, hours: 0, minutes: 0 };
    }

    // Show days and hours when clamping at hour and we have at least one hour
    if (clampAt === 'hour' && totalHours >= 1) {
      return {
        days: Math.floor(totalHours / 24),
        hours: totalHours % 24,
        minutes: 0,
      };
    }

    // Default case: show all units
    return {
      days: Math.floor(totalHours / 24),
      hours: Math.floor(totalMinutes / 60) % 24,
      minutes: Math.round(totalMinutes % 60),
    };
  };

  const { days: d, hours: h, minutes: m } = getDuration();

  const intlLocale = getIntlLocale(locale);
  const formatters = {
    day: createUnitFormatter({ locale: intlLocale, unit: 'day', unitDisplay }),
    hour: createUnitFormatter({
      locale: intlLocale,
      unit: 'hour',
      unitDisplay,
    }),
    minute: createUnitFormatter({
      locale: intlLocale,
      unit: 'minute',
      unitDisplay,
    }),
  };

  const parts = [
    d > 0 && formatters.day.format(d),
    h > 0 && formatters.hour.format(h),
    m > 0 && formatters.minute.format(m),
  ].filter(Boolean);

  return parts.join(separator);
}
