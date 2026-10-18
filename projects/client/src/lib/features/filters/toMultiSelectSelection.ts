import type { MultiSelectSelection } from '$lib/components/select/models/MultiSelectSelection.ts';
import { EXCLUSION_PREFIX } from './exclusionPrefix.ts';

type Token = { value: string; isExcluded: boolean };

const toToken = (raw: string): Token =>
  raw.startsWith(EXCLUSION_PREFIX)
    ? { value: raw.slice(EXCLUSION_PREFIX.length), isExcluded: true }
    : { value: raw, isExcluded: false };

const toValues = (tokens: ReadonlyArray<Token>, isExcluded: boolean) =>
  tokens
    .filter((token) => token.isExcluded === isExcluded)
    .map((token) => token.value);

export function toMultiSelectSelection(
  raw: string | Nil,
): MultiSelectSelection {
  const tokens = raw ? raw.split(',').filter(Boolean).map(toToken) : [];
  const unique = tokens.filter(
    (token, index) =>
      tokens.findIndex(({ value }) => value === token.value) === index,
  );

  return {
    included: toValues(unique, false),
    excluded: toValues(unique, true),
  };
}
