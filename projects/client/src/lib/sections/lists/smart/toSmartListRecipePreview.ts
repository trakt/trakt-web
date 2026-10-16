import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';

const PREVIEW_LABEL_COUNT = 3;

export function toSmartListRecipePreview(
  list: Pick<SmartList, 'source' | 'filters'>,
) {
  const labels = getSmartListFilterLabels(list);

  return {
    summary: labels.slice(0, PREVIEW_LABEL_COUNT).join(', '),
    remaining: Math.max(labels.length - PREVIEW_LABEL_COUNT, 0),
  };
}
