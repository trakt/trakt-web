/**
 * Three tier rarity bucket for a shared subgenre. Buckets are based
 * on the server's globally-normalized `rarity` value, so thresholds
 * are stable across user pairs.
 *
 *   - "common"   (rarity < 0.33): popular topic - muted chip.
 *   - "notable"  (rarity 0.33 .. 0.66): mid-tier - saturated chip.
 *   - "rare"     (rarity >= 0.66): niche taste agreement - chip
 *     glows and gets a sparkle marker.
 *   - "unknown": rarity not provided by the server. Pre-corpus
 *     fallback. Render as plain neutral chip; do not imply
 *     "common".
 */
export type RarityTier = 'unknown' | 'common' | 'notable' | 'rare';

const NOTABLE_THRESHOLD = 0.33;
const RARE_THRESHOLD = 0.66;

export function rarityTier(rarity: number | undefined): RarityTier {
  if (rarity == null) return 'unknown';
  if (rarity >= RARE_THRESHOLD) return 'rare';
  if (rarity >= NOTABLE_THRESHOLD) return 'notable';
  return 'common';
}
