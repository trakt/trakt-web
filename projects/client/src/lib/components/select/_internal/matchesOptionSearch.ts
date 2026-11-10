import type { SelectOption } from '../models/SelectOption.ts';

type MatchesOptionSearchParams = {
  option: SelectOption;
  search: string;
};

export function matchesOptionSearch({
  option,
  search,
}: MatchesOptionSearchParams): boolean {
  return [option.label, ...(option.keywords ?? [])].some((text) =>
    text.toLowerCase().includes(search),
  );
}
