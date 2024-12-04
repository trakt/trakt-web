import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export type Duration = {
  days: number;
  hours: number;
  minutes: number;
};

export function toHumanDuration({
  days = 0,
  hours = 0,
  minutes = 0,
}, locale: AvailableLanguage = 'en') {
  hours += Math.floor(minutes / 60);
  minutes %= 60;
  days += Math.floor(hours / 24);
  hours %= 24;

  const formatters = {
    day: new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'day',
      unitDisplay: 'narrow',
    }),
    hour: new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'hour',
      unitDisplay: 'narrow',
    }),
    minute: new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'minute',
      unitDisplay: 'narrow',
    }),
  };

  const parts = [];
  if (days > 0) {
    parts.push(formatters.day.format(days));
  }
  if (hours > 0) {
    parts.push(formatters.hour.format(hours));
  }
  if (minutes > 0) {
    parts.push(formatters.minute.format(minutes));
  }

  return parts.join(' ');
}
