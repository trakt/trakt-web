import * as m from '$lib/features/i18n/messages.ts';
import type { MovieLore } from '$lib/requests/models/MovieLore.ts';

type LockedCounts = NonNullable<MovieLore['locked']>;

function toLoreCount(count: number) {
  return count === 1
    ? m.text_movie_lore_things_to_know_one({ count })
    : m.text_movie_lore_things_to_know_other({ count });
}

function toPreviouslyCount(count: number) {
  return count === 1
    ? m.text_movie_lore_previously_recapped_one({ count })
    : m.text_movie_lore_previously_recapped_other({ count });
}

export function toLockedTease({ lore, previously }: LockedCounts) {
  const [first, second] = [
    lore > 0 ? toLoreCount(lore) : null,
    previously > 0 ? toPreviouslyCount(previously) : null,
  ].filter((part) => part !== null);

  if (!first) return '';
  if (!second) return first;

  return m.text_recap_meta_pair({ first, second });
}
