import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { Filter } from '../models/Filter.ts';
import { EXCLUSION_PREFIX } from './exclusionPrefix.ts';

type mapToSearchParamValueProps = {
  filter: Filter;
  value: string | Nil;
  user: UserSettings;
};

export function mapToSearchParamValue({
  filter,
  value,
  user,
}: mapToSearchParamValueProps): string {
  const filterValue = assertDefined(value, 'Filter value is required');

  if ('options' in filter) {
    const mapValue = (rawValue: string) => {
      const isExcluded = rawValue.startsWith(EXCLUSION_PREFIX);
      const v = isExcluded ? rawValue.slice(EXCLUSION_PREFIX.length) : rawValue;

      const option = filter.options.find((opt) => opt.value === v);
      const mapped = option?.mapper ? option.mapper(user).split(',') : [v];

      return isExcluded
        ? mapped.map((token) => `${EXCLUSION_PREFIX}${token}`)
        : mapped;
    };

    return filterValue.split(',').flatMap(mapValue).join(',');
  }

  return filterValue;
}
