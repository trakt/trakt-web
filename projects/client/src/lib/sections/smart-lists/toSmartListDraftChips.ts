import type { SmartListDraft } from '$lib/requests/models/SmartListDraft.ts';
import { getSmartListFilterLabels } from '$lib/sections/lists/smart/getSmartListFilterLabels.ts';
import type { SmartListAwardLabel } from '$lib/sections/lists/smart/models/SmartListAwardLabel.ts';
import { toSmartListMediaTypeLabel } from '$lib/sections/lists/smart/toSmartListMediaTypeLabel.ts';

export function toSmartListDraftChips(
  draft: SmartListDraft,
  awardLabels?: ReadonlyMap<string, SmartListAwardLabel>,
): string[] {
  const [source, ...filters] = getSmartListFilterLabels(draft, awardLabels);

  return [source, toSmartListMediaTypeLabel(draft.mediaType), ...filters];
}
