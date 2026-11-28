import { m } from '$lib/features/i18n/messages.ts';
import { attachDecoration } from '../shared/attachDecoration.ts';
import { detachAll } from '../shared/detachAll.ts';
import { attachNavbarCountdown } from './attachNavbarCountdown.ts';
import { attachThreatTags } from './attachThreatTags.ts';
import { attachTitleSlam } from './attachTitleSlam.ts';
import { sigilMarkup } from './sigilMarkup.ts';

const CARD_COVERS =
  '.trakt-card-cover, .trakt-calendar-poster-tile .tile-poster';
const SUMMARY_POSTER = '.trakt-summary-poster-container[data-variant]';

const PLATE_MARKUP = '<span class="doom-plate-scan"></span>';

const FORGE_MARKUP = [
  '<span class="doom-forge-edge"></span>',
  `<span class="doom-forge-plate">${m.text_topic_doom_forge_plate()}</span>`,
].join('');

const DOSSIER_MARKUP = [
  `<span class="doom-dossier-tag"><i></i>${m.text_topic_doom_dossier_tag()}</span>`,
  `<span class="doom-dossier-id">${m.text_topic_doom_dossier_id()}</span>`,
].join('');

export function decorateDoomsday() {
  return detachAll([
    attachDecoration({
      selector: CARD_COVERS,
      className: 'doom-plate',
      markup: PLATE_MARKUP,
    }),
    attachDecoration({
      selector: '.trakt-list-header',
      className: 'doom-hud-line',
    }),
    attachDecoration({
      selector: SUMMARY_POSTER,
      className: 'doom-poster-sigil',
      markup: sigilMarkup({ seed: 666 }),
      prepend: true,
    }),
    attachDecoration({
      selector: SUMMARY_POSTER,
      className: 'doom-poster-forge',
      markup: FORGE_MARKUP,
    }),
    attachDecoration({
      selector: '.trakt-profile-image',
      className: 'doom-avatar-sigil',
      markup: sigilMarkup({ seed: 9, variant: 'ring' }),
    }),
    attachDecoration({
      selector: '.trakt-landing-spotlight',
      className: 'doom-landing-sigil',
      markup: sigilMarkup({ seed: 314 }),
      prepend: true,
    }),
    attachTitleSlam(),
    attachThreatTags(),
    attachDecoration({
      selector: '.trakt-profile-container',
      className: 'doom-dossier',
      markup: DOSSIER_MARKUP,
    }),
    attachDecoration({
      selector:
        '.trakt-kpi-tile .kpi-label, .trakt-pulse-graph > p:first-child',
      className: 'doom-readout-code',
      prepend: true,
    }),
    attachNavbarCountdown(),
  ]);
}
