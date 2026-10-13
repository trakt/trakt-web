import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { SmartListItemResponse } from '$lib/requests/models/SmartListItemResponse.ts';

export function mapToSmartListItem(item: SmartListItemResponse) {
  if (item.type === 'show') {
    return mapToShowEntry(
      assertDefined(item.show, 'Expected show in SmartListItemResponse'),
    );
  }

  return mapToMovieEntry(
    assertDefined(item.movie, 'Expected movie in SmartListItemResponse'),
  );
}
