import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';

/**
 * Contract every bulk-edit action implements. The header owns selection
 * (count, select all, cancel); an action only acts on the items it is handed
 * and calls `onDone` once it has finished, which ends the edit session.
 */
export type BulkEditActionProps = {
  list: MediaListSummary;
  items: ReadonlyArray<ListItem>;
  onDone: () => void;
};
