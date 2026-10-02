import type { ReactionPickerOption } from './ReactionPickerOption.ts';

const normalize = (value: string) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export function matchesReactionSearch(
  option: ReactionPickerOption,
  query: string,
): boolean {
  const term = normalize(query);
  if (term === '') return true;

  return [option.label, option.id.replaceAll('_', ' '), ...option.keywords]
    .some((candidate) => normalize(candidate).includes(term));
}
