import type { MultiSelectSelection } from '$lib/components/select/models/MultiSelectSelection.ts';
import { EXCLUSION_PREFIX } from './_internal/exclusionPrefix.ts';

export function toMultiSelectSelection(
  raw: string | Nil,
): MultiSelectSelection {
  const tokens = raw ? raw.split(',').filter(Boolean) : [];

  return {
    included: tokens.filter((token) => !token.startsWith(EXCLUSION_PREFIX)),
    excluded: tokens
      .filter((token) => token.startsWith(EXCLUSION_PREFIX))
      .map((token) => token.slice(EXCLUSION_PREFIX.length)),
  };
}
