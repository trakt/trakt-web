import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { Filter } from '../models/Filter.ts';

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
    const option = filter.options.find((opt) => opt.value === filterValue);
    return option?.mapper ? option.mapper(user) : filterValue;
  }

  return filterValue;
}
