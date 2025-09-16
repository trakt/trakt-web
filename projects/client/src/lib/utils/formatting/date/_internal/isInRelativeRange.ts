import { intervalToDuration } from 'date-fns/intervalToDuration';

function stripTime(date: Date): Date {
  return new Date(date.toDateString());
}

export function isInRelativeRange(today: Date, date: Date) {
  const { days = 0, months = 0, years = 0 } = intervalToDuration({
    start: stripTime(today),
    end: stripTime(date),
  });

  const isInMonthRange = years === 0 && months === 0;
  const isInDaysRange = days >= -6 && days <= 6;

  return isInMonthRange && isInDaysRange;
}
