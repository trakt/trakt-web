import type { VipAchievementId } from '../models/VipAchievementId.ts';
import type { PinGlyph } from './PinGlyph.ts';
import { pinGlyphs } from './pinGlyphs.ts';

type AchievementPin = {
  /** Enamel colour token, from `style/palette/achievement-pin.css`. */
  color: `--achievement-pin-${string}`;
  glyph: PinGlyph;
};

/** Every achievement's pin: its own colour and artwork. */
export const achievementPins: Record<VipAchievementId, AchievementPin> = {
  'opening-credits': {
    color: '--achievement-pin-red',
    glyph: pinGlyphs.clapper,
  },
  'century-club': {
    color: '--achievement-pin-cobalt',
    glyph: pinGlyphs.ticket,
  },
  'time-spent-episodes': {
    color: '--achievement-pin-teal',
    glyph: pinGlyphs.tv,
  },
  'time-spent-movies': {
    color: '--achievement-pin-peach',
    glyph: pinGlyphs.reel,
  },
  'show-completionist': {
    color: '--achievement-pin-emerald',
    glyph: pinGlyphs.flag,
  },
  'daily-streak': {
    color: '--achievement-pin-tangerine',
    glyph: pinGlyphs.chain,
  },
  'night-owl': { color: '--achievement-pin-midnight', glyph: pinGlyphs.moon },
  'marathon-fever': { color: '--achievement-pin-butter', glyph: pinGlyphs.sun },
  'double-feature': {
    color: '--achievement-pin-lime',
    glyph: pinGlyphs.double,
  },
  'rating-machine': {
    color: '--achievement-pin-sky',
    glyph: pinGlyphs.megaphone,
  },
  'perfect-ten': { color: '--achievement-pin-rose', glyph: pinGlyphs.star },
  scribe: { color: '--achievement-pin-brick', glyph: pinGlyphs.nib },
  'list-maker': { color: '--achievement-pin-slate', glyph: pinGlyphs.cards },
  'feature-presentation': {
    color: '--achievement-pin-cherry',
    glyph: pinGlyphs.popcorn,
  },
  'pilot-season': {
    color: '--achievement-pin-indigo',
    glyph: pinGlyphs.remote,
  },
  'nostalgia-trip': {
    color: '--achievement-pin-plum',
    glyph: pinGlyphs.rewind,
  },
  'long-haul': {
    color: '--achievement-pin-olive',
    glyph: pinGlyphs.mountain,
  },
  'early-bird': {
    color: '--achievement-pin-aqua',
    glyph: pinGlyphs.sunrise,
  },
  'season-ticket': {
    color: '--achievement-pin-jade',
    glyph: pinGlyphs.calendar,
  },
  'weekly-ritual': {
    color: '--achievement-pin-amber',
    glyph: pinGlyphs.candle,
  },
  'full-spectrum': {
    color: '--achievement-pin-grape',
    glyph: pinGlyphs.bars,
  },
  'hard-to-please': {
    color: '--achievement-pin-ocean',
    glyph: pinGlyphs.storm,
  },
  'instant-verdict': {
    color: '--achievement-pin-magenta',
    glyph: pinGlyphs.stopwatch,
  },
  'episode-by-episode': {
    color: '--achievement-pin-mint',
    glyph: pinGlyphs.film,
  },
  'hall-of-fame': {
    color: '--achievement-pin-coral',
    glyph: pinGlyphs.heart,
  },
  'shelf-life': {
    color: '--achievement-pin-ice',
    glyph: pinGlyphs.disc,
  },
  'ensemble-cast': {
    color: '--achievement-pin-denim',
    glyph: pinGlyphs.people,
  },
  'fan-club': {
    color: '--achievement-pin-flamingo',
    glyph: pinGlyphs.pennant,
  },
  'trakt-pioneer': {
    color: '--achievement-pin-sand',
    glyph: pinGlyphs.hourglass,
  },
  'credits-roll': {
    color: '--achievement-pin-lavender',
    glyph: pinGlyphs.trophy,
  },
  countdown: {
    color: '--achievement-pin-charcoal',
    glyph: pinGlyphs.clock,
  },
  'leap-day': {
    color: '--achievement-pin-forest',
    glyph: pinGlyphs.frog,
  },
  'groundhog-day': {
    color: '--achievement-pin-cocoa',
    glyph: pinGlyphs.loop,
  },
};
