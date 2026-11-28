import { m } from '$lib/features/i18n/messages.ts';
import { attachAll } from '../shared/attachAll.ts';
import { calendarDate } from './calendarDate.ts';
import { injectDecoration } from '../shared/injectDecoration.ts';
import { RELEASE_DATE } from '../shared/RELEASE_DATE.ts';
import { releaseCountdown } from '../shared/releaseCountdown.ts';

const isDunesday = (date: Date) =>
  date.getFullYear() === RELEASE_DATE.getFullYear() &&
  date.getMonth() === RELEASE_DATE.getMonth() &&
  date.getDate() === RELEASE_DATE.getDate();

const badge = (kicker: string, text: string) =>
  `<span class="dd-day-kicker">${kicker}</span><span class="dd-day-text">${text}</span>`;

export function attachCalendarMarks() {
  return attachAll({
    selector: '.trakt-calendar-day-header',
    attach: (header) => {
      const date = calendarDate(header);
      if (date && isDunesday(date)) {
        header.classList.add('dd-is-dunesday');
        const remove = injectDecoration({
          host: header,
          className: 'dd-day-badge',
          markup: badge(
            m.text_topic_dunesday_double_feature(),
            m.text_topic_dunesday_name(),
          ),
        });
        return () => {
          remove();
          header.classList.remove('dd-is-dunesday');
        };
      }

      if (!header.classList.contains('is-today')) return;
      const { calendarDays: days } = releaseCountdown(Date.now());
      if (days === 0) return;
      return injectDecoration({
        host: header,
        className: 'dd-day-badge',
        markup: badge(
          m.text_topic_dunesday_name(),
          m.text_topic_dunesday_days_to_go({ days }),
        ),
      });
    },
  });
}
