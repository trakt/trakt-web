/**
 * Visual tier for a shared-topic chip. Two channels combined:
 *
 * 1. **Unicorn override** - if the server-supplied `rarity` clears
 *    `UNICORN_THRESHOLD`, the chip is a genuine cross-axis-rare topic
 *    (the slug is rare on both the movie AND show corpora, per the
 *    MIN-rarity backend). Wins regardless of position.
 * 2. **Positional fallback** - tier reflects the chip's index in the
 *    server-returned ranking (ordered by `watchCount × rarity`).
 *    Always produces visual hierarchy even when no chip is globally
 *    rare:
 *
 *      index 0      -> rare    (the hero chip)
 *      index 1..2   -> notable (the strong runners-up)
 *      index 3+     -> common  (the supporting cast)
 *
 * Sparkle on `rare` reads as "your most distinctive shared topic
 * with this person" - relative to the pairing. The `unicorn` tier
 * upgrades to a purple-tinted glow to call out "you both share
 * something genuinely uncommon across the whole platform" - the
 * super-rare flair.
 */
export type ChipTier = 'unicorn' | 'rare' | 'notable' | 'common';

// MIN-rarity backend compresses values; anything >= 0.5 means the
// slug is rare on BOTH the movie and show axes, which is the threshold
// for "globally distinctive" rather than "just popular on one side".
const UNICORN_THRESHOLD = 0.5;

export function chipTier(
  index: number,
  rarity: number | undefined,
): ChipTier {
  if (rarity != null && rarity >= UNICORN_THRESHOLD) return 'unicorn';
  if (index <= 0) return 'rare';
  if (index <= 2) return 'notable';
  return 'common';
}
