import {
  type AvailableLanguage,
  getIntlLocale,
} from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { time } from '$lib/utils/timing/time.ts';

type ToHumanOfferEndProps = {
  endsAt: Date;
  now: Date;
  locale: AvailableLanguage;
  timeZone?: string;
};

function toDayKey(date: Date, timeZone: string | undefined) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).format(date);
}

export function toHumanOfferEnd({
  endsAt,
  now,
  locale,
  timeZone,
}: ToHumanOfferEndProps): string {
  const lastMinute = new Date(endsAt.getTime() - time.minutes(1));
  const intlLocale = getIntlLocale(locale);

  if (toDayKey(lastMinute, timeZone) === toDayKey(now, timeZone)) {
    return m.text_promotion_ends_today({
      time: new Intl.DateTimeFormat(intlLocale, {
        hour: 'numeric',
        minute: '2-digit',
        timeZone,
      }).format(lastMinute),
    });
  }

  return m.text_promotion_ends_on({
    date: new Intl.DateTimeFormat(intlLocale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(lastMinute),
  });
}
