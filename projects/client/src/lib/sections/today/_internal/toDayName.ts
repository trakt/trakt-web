import * as m from '$lib/features/i18n/messages.ts';
import type { TodayDayKind } from '../models/TodayDayKind.ts';

export function toDayName(kind: TodayDayKind): string {
  switch (kind) {
    case 'today':
      return m.option_text_today_day_today();
    case 'yesterday':
      return m.option_text_today_day_yesterday();
    case 'week':
      return m.option_text_today_day_week();
  }
}
