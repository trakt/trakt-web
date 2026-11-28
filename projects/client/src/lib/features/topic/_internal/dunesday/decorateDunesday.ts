import { detachAll } from '../shared/detachAll.ts';
import { attachDecoration } from '../shared/attachDecoration.ts';
import { attachCalendarMarks } from './attachCalendarMarks.ts';
import { attachLockups } from './attachLockups.ts';
import { attachSideCard } from './attachSideCard.ts';

const CARD_MARKUP = '<span class="dd-card-glass"></span>';

const EMBLEM = `<svg viewBox="0 0 48 48" width="48" height="48"><defs><clipPath id="dd-streak-dune"><path d="M0 0 H27 L21 48 H0 Z"/></clipPath><clipPath id="dd-streak-doom"><path d="M27 0 H48 V48 H21 Z"/></clipPath></defs><g clip-path="url(#dd-streak-dune)"><circle class="dd-streak-sun" cx="24" cy="22" r="10"/><path class="dd-streak-dune" d="M2 40 C12 30 20 35 26 33 C32 31 38 33 46 38 V46 H2 Z"/></g><g clip-path="url(#dd-streak-doom)"><g class="dd-streak-sigil"><circle cx="24" cy="24" r="17" fill="none" stroke-width="2" stroke-dasharray="4 2.4"/><circle cx="24" cy="24" r="9" fill="none" stroke-width="2"/><path d="M24 3 V9 M24 39 V45 M39 24 H45" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="3"/></g></g><path d="M27 2 L21 46" class="dd-streak-seam"/></svg>`;

export function decorateDunesday() {
  return detachAll([
    attachDecoration({
      selector:
        '.trakt-card-cover, .trakt-calendar-poster-tile .tile-poster, .trakt-summary-poster',
      className: 'dd-card',
      markup: CARD_MARKUP,
    }),
    attachLockups(),
    attachDecoration({
      selector: '.trakt-user-avatar, .trakt-profile-image',
      className: 'dd-avatar-ring',
    }),
    attachDecoration({
      selector: '.trakt-streak-flame',
      className: 'dd-streak',
      markup: EMBLEM,
    }),
    attachCalendarMarks(),
    attachSideCard(),
  ]);
}
