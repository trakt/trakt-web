import type { SmartListDraft } from '$lib/requests/models/SmartListDraft.ts';
import { getSmartListFilterLabels } from '$lib/sections/lists/smart/getSmartListFilterLabels.ts';
import { toSmartListMediaTypeLabel } from '$lib/sections/lists/smart/toSmartListMediaTypeLabel.ts';

export function toSmartListDraftChips(draft: SmartListDraft): string[] {
  const [source, ...filters] = getSmartListFilterLabels(draft);

  return [source, toSmartListMediaTypeLabel(draft.mediaType), ...filters];
}
