import { RELEASE_DATE } from './RELEASE_DATE.ts';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const startOfDay = (time: number) => {
  const date = new Date(time);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
};

export function releaseCountdown(now: number) {
  const remaining = Math.max(0, RELEASE_DATE.getTime() - now);

  return {
    calendarDays: Math.max(
      0,
      Math.round((RELEASE_DATE.getTime() - startOfDay(now)) / DAY),
    ),
    wholeDays: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    totalHours: Math.floor(remaining / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    released: remaining === 0,
  };
}
