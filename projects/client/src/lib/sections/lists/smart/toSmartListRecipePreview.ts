import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';
import type { SmartListAwardLabel } from './models/SmartListAwardLabel.ts';

const PREVIEW_LABEL_COUNT = 3;

export function toSmartListRecipePreview(
  list: Pick<SmartList, 'source' | 'filters'>,
  awardLabels?: ReadonlyMap<string, SmartListAwardLabel>,
) {
  const labels = getSmartListFilterLabels(list, awardLabels);

  return {
    summary: labels.slice(0, PREVIEW_LABEL_COUNT).join(', '),
    remaining: Math.max(labels.length - PREVIEW_LABEL_COUNT, 0),
  };
}
