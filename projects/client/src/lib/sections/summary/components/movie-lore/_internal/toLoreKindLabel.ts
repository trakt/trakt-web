import * as m from '$lib/features/i18n/messages.ts';
import type { MovieLoreKind } from '$lib/requests/models/MovieLoreKind.ts';

export function toLoreKindLabel(kind: MovieLoreKind) {
  switch (kind) {
    case 'series':
      return m.text_movie_lore_kind_series();
    case 'adaptation':
      return m.text_movie_lore_kind_adaptation();
    case 'rich_world':
      return m.text_movie_lore_kind_rich_world();
    case 'true_story':
      return m.text_movie_lore_kind_true_story();
    case 'standalone':
      return m.text_movie_lore_kind_standalone();
  }
}
