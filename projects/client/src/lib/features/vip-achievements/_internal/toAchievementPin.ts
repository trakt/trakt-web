import type { VipAchievement } from '../models/VipAchievement.ts';
import { achievementPins } from './achievementPins.ts';
import { pinGlyphs } from './pinGlyphs.ts';

type DisplayedPin = (typeof achievementPins)[keyof typeof achievementPins];

const MYSTERY_PIN: DisplayedPin = {
  color: '--achievement-pin-mystery',
  glyph: pinGlyphs.mystery,
};

/** The pin to draw: a secret still to be found keeps its artwork hidden. */
export function toAchievementPin(achievement: VipAchievement): DisplayedPin {
  return achievement.isHidden ? MYSTERY_PIN : achievementPins[achievement.id];
}
