import { m } from '$lib/features/i18n/messages.ts';
import type { DunesdaySide } from './DunesdaySide.ts';

const verdictFor = (side: DunesdaySide) => {
  switch (side) {
    case 'dune':
      return {
        side,
        title: m.text_topic_dunesday_team_dune(),
        line: m.text_topic_dunesday_verdict_dune(),
      };
    case 'doom':
      return {
        side,
        title: m.text_topic_dunesday_team_doom(),
        line: m.text_topic_dunesday_verdict_doom(),
      };
    case 'double':
      return {
        side,
        title: m.text_topic_dunesday_double_feature(),
        line: m.text_topic_dunesday_verdict_double(),
      };
  }
};

export function sideVerdict(share: number) {
  if (share >= 58) return verdictFor('dune');
  if (share <= 42) return verdictFor('doom');
  return verdictFor('double');
}
