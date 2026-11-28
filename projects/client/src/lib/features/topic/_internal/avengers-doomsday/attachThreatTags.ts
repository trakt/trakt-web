import { m } from '$lib/features/i18n/messages.ts';
import { attachAll } from '../shared/attachAll.ts';
import { attachDecoration } from '../shared/attachDecoration.ts';
import { detachAll } from '../shared/detachAll.ts';
import { injectDecoration } from '../shared/injectDecoration.ts';
import { threatLevel } from './threatLevel.ts';
import { threatMarkup } from './threatMarkup.ts';

const tagTile = (tile: HTMLElement) => {
  const status =
    tile.querySelector<HTMLElement>('.trakt-episode-status-indicator')?.dataset
      .status ?? '';
  const level = threatLevel(status);
  const poster = tile.querySelector<HTMLElement>('.tile-poster');
  if (!level || !poster) return;

  return injectDecoration({
    host: poster,
    className: `doom-threat-tag${level >= 4 ? ' is-critical' : ''}`,
    markup: threatMarkup(level),
  });
};

export function attachThreatTags() {
  return detachAll([
    attachAll({ selector: '.trakt-calendar-poster-tile', attach: tagTile }),
    attachDecoration({
      selector:
        '.week-head-day.is-today, .trakt-calendar-day-header.is-today[data-variant="row"]',
      className: 'doom-threat-today',
      markup: `<i></i>${m.text_topic_doom_threat_imminent()}`,
    }),
  ]);
}
