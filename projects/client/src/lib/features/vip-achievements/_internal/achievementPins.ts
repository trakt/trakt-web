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
};
