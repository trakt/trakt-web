import * as m from '$lib/features/i18n/messages.ts';
import type { YirTraitId } from '$lib/requests/models/YirPersonaResult.ts';

const LABELS: Record<YirTraitId, () => string> = {
  'streak-keeper': m.yir_2026_trait_streak_keeper,
  'night-owl': m.yir_2026_trait_night_owl,
  'early-bird': m.yir_2026_trait_early_bird,
  'weekend-warrior': m.yir_2026_trait_weekend_warrior,
  'time-traveler': m.yir_2026_trait_time_traveler,
  globetrotter: m.yir_2026_trait_globetrotter,
  'social-butterfly': m.yir_2026_trait_social_butterfly,
  automaton: m.yir_2026_trait_automaton,
  'app-hopper': m.yir_2026_trait_app_hopper,
  'silent-watcher': m.yir_2026_trait_silent_watcher,
  'hype-machine': m.yir_2026_trait_hype_machine,
  'tough-crowd': m.yir_2026_trait_tough_crowd,
  polariser: m.yir_2026_trait_polariser,
  'live-checker': m.yir_2026_trait_live_checker,
  'doc-nerd': m.yir_2026_trait_doc_nerd,
  'horror-hound': m.yir_2026_trait_horror_hound,
  'fresh-start': m.yir_2026_trait_fresh_start,
};

export function traitLabel(id: YirTraitId): string {
  return LABELS[id]();
}
