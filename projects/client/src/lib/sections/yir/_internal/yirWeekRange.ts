import { addDays } from 'date-fns/addDays';
import { max } from 'date-fns/max';
import { min } from 'date-fns/min';
import { startOfWeek } from 'date-fns/startOfWeek';

type YirWeekRange = {
  start: Date;
  end: Date;
};

export function yirWeekRange(year: number, week: number): YirWeekRange {
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  const monday = addDays(startOfWeek(firstDay, { weekStartsOn: 1 }), week * 7);

  return {
    start: max([monday, firstDay]),
    end: min([addDays(monday, 6), lastDay]),
  };
}
