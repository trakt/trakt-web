import * as m from '$lib/features/i18n/messages.ts';

/**
 * Tonal label for a 0-100 match score. Bands tuned to how real Trakt
 * users actually score against each other - subgenre overlap is broad
 * and most paired users land in the 20-60 zone even when their taste
 * meaningfully aligns. Generous on purpose: 30-40% should read positive,
 * not "you have nothing in common".
 */
export function matchLabel(score: number): string {
  if (score >= 75) return m.match_label_soul_twin();
  if (score >= 55) return m.match_label_strong_match();
  if (score >= 35) return m.match_label_aligned_tastes();
  if (score >= 20) return m.match_label_common_ground();
  if (score >= 8) return m.match_label_light_overlap();
  return m.match_label_different_scenes();
}
