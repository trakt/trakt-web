import * as m from '$lib/features/i18n/messages.ts';
import type { MovieLore } from '$lib/requests/models/MovieLore.ts';
import { toEarlierFilmsLabel } from '../toEarlierFilmsLabel.ts';
import { toLoreKindLabel } from './toLoreKindLabel.ts';

export function toLoreHeroLabel({
  kind,
  earlier,
}: Pick<MovieLore, 'kind' | 'earlier'>) {
  const kindLabel = toLoreKindLabel(kind);

  if (earlier.length === 0) {
    return kindLabel;
  }

  return m.text_recap_meta_pair({
    first: kindLabel,
    second: toEarlierFilmsLabel(earlier.length),
  });
}
