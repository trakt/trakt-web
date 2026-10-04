import * as m from '$lib/features/i18n/messages.ts';
import type { TodayMilestone } from '../models/TodayMilestone.ts';

export function toMilestoneLabel(milestone: TodayMilestone): string {
  switch (milestone.type) {
    case 'series-start':
      return m.tag_text_today_started_show();
    case 'season-start':
      return m.tag_text_today_started_season({ season: milestone.season });
    case 'season-end':
      return m.tag_text_today_finished_season({ season: milestone.season });
    case 'series-end':
      return m.tag_text_today_finished_show();
  }
}
