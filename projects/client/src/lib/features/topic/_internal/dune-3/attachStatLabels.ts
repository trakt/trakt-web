import { m } from '$lib/features/i18n/messages.ts';
import { attachAll } from '../shared/attachAll.ts';
import { injectDecoration } from '../shared/injectDecoration.ts';

const themedLabels = (): ReadonlyMap<string, string> =>
  new Map([
    [m.stat_text_plays(), m.text_topic_dune_stat_plays()],
    [m.stat_text_time_watched(), m.text_topic_dune_stat_watched()],
    [m.label_stats_ratings(), m.text_topic_dune_stat_ratings()],
    [m.label_stats_comments(), m.text_topic_dune_stat_comments()],
    [m.tag_text_episodes(), m.tag_text_episodes()],
    [m.tag_text_shows(), m.text_topic_dune_stat_shows()],
    [m.tag_text_movies(), m.text_topic_dune_stat_movies()],
  ]);

export function attachStatLabels() {
  const labels = themedLabels();

  return attachAll({
    selector: '.trakt-stat .stat-value > p.tag.secondary',
    attach: (label) => {
      const text = labels.get(label.textContent?.trim() ?? '');
      if (!text) return;
      return injectDecoration({
        host: label,
        className: 'dn3-stat-label',
        markup: text,
      });
    },
  });
}
