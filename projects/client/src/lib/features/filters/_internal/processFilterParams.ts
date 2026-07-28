import type { ParameterType } from '../../parameters/_internal/createParameterContext.ts';
import { FILTERS } from './constants.ts';

/*
  Surface-restricted filters are deliberately excluded: they are saved and
  restored as global defaults, and a calendar-only key like `episode_types`
  would then be replayed onto every other filterable page's URL.
*/
const GLOBAL_FILTER_KEYS: ReadonlyArray<string> = FILTERS
  .filter((filter) => !filter.surfaces)
  .map((filter) => filter.key);

export function processFilterParams(
  params:
    | Array<[string, ParameterType]>
    | URLSearchParamsIterator<[string, ParameterType]>,
  callback: (key: string, value: ParameterType) => void,
) {
  Array.from(params).forEach(([key, value]) => {
    const isValidKey = GLOBAL_FILTER_KEYS.includes(key);
    isValidKey && callback(key, value);
  });
}
