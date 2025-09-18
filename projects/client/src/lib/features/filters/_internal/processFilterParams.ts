import type { ParameterType } from '../../parameters/_internal/createParameterContext.ts';
import { FILTERS } from './constants.ts';

export function processFilterParams(
  params:
    | Array<[string, ParameterType]>
    | URLSearchParamsIterator<[string, ParameterType]>,
  callback: (key: string, value: ParameterType) => void,
) {
  Array.from(params).forEach(([key, value]) => {
    const isValidKey = FILTERS.some((filter) => filter.key === key);
    isValidKey && callback(key, value);
  });
}
