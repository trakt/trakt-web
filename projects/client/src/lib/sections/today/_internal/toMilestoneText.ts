import * as m from '$lib/features/i18n/messages.ts';
import type { TodayMilestone } from '../models/TodayMilestone.ts';

export function toMilestoneText(milestone: TodayMilestone): string {
  switch (milestone.type) {
    case 'series-start':
    case 'series-end':
      return m.translated_value_type_show();
    case 'season-start':
    case 'season-end':
      return m.text_season_number({ number: milestone.season });
  }
}
