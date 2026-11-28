import { m } from '$lib/features/i18n/messages.ts';
import { attachDecoration } from '../shared/attachDecoration.ts';
import { sunMoonsGlyph } from './sunMoonsGlyph.ts';

export function attachCalendarSun() {
  return attachDecoration({
    selector:
      '.week-head-day.is-today, .trakt-calendar-day-header.is-today[data-variant="row"]',
    className: 'dn3-today',
    markup: `${sunMoonsGlyph()}<span>${m.text_calendar_today()}</span>`,
  });
}
