import type { SearchFieldVariant } from '$lib/components/form/models/SearchFieldVariant.ts';
import type { ListSearch } from './ListSearch.ts';
import type { ListSearchCopy } from './ListSearchCopy.ts';

export type ListSearchInputProps = {
  search: ListSearch;
  copy: ListSearchCopy;
  variant?: SearchFieldVariant;
};
