import type { MultiSelectSelection } from '$lib/components/select/models/MultiSelectSelection.ts';
import { EXCLUSION_PREFIX } from './_internal/exclusionPrefix.ts';

export function fromMultiSelectSelection(
  { included, excluded }: MultiSelectSelection,
): string | null {
  const tokens = [
    ...included,
    ...excluded.map((value) => `${EXCLUSION_PREFIX}${value}`),
  ];

  return tokens.length > 0 ? tokens.join(',') : null;
}
