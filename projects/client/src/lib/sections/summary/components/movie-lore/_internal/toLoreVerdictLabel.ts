import * as m from '$lib/features/i18n/messages.ts';
import type { MovieLoreVerdict } from '$lib/requests/models/MovieLoreVerdict.ts';

export function toLoreVerdictLabel(verdict: MovieLoreVerdict) {
  switch (verdict) {
    case 'required':
      return m.text_movie_lore_verdict_required();
    case 'helpful':
      return m.text_movie_lore_verdict_helpful();
    case 'not_needed':
      return m.text_movie_lore_verdict_not_needed();
  }
}
