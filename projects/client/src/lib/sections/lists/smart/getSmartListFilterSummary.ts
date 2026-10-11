import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';

export function getSmartListFilterSummary(list: SmartList): string {
  return getSmartListFilterLabels(list).join(', ');
}
