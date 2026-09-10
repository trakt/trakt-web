import { getSearchContext } from './_internal/getSearchContext.ts';

export function useSearchConfig() {
  return getSearchContext().config;
}
