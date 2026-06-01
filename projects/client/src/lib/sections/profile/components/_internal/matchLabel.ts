import * as m from '$lib/features/i18n/messages.ts';

/**
 * Tonal label for a 0-100 match score. Six-tier ladder anchored on
 * "Soulmates" at the top and "Different universe" at the bottom; the
 * middle four use cinematic/multiverse vocabulary that translates as
 * loanwords in every Trakt locale. Thresholds are tuned to the
 * post-corpus distribution (engaged-pair median lands ~65, with rare
 * users hitting the 90+ band).
 */
export function matchLabel(score: number): string {
  if (score >= 90) return m.match_label_soulmates();
  if (score >= 75) return m.match_label_co_stars();
  if (score >= 60) return m.match_label_crossover();
  if (score >= 45) return m.match_label_spin_off();
  if (score >= 25) return m.match_label_cameo();
  return m.match_label_different_universe();
}
