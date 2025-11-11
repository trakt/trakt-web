import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { ListedMediaResponse } from '@trakt/api';
import { mapToMovieEntry } from './mapToMovieEntry.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';

function mapListDetails(
  listedItem: ListedMediaResponse,
) {
  return {
    id: listedItem.id,
    key: `${listedItem.type}-${listedItem.id}`,
    rank: listedItem.rank,
    notes: listedItem.notes,
    type: listedItem.type,
    listedAt: new Date(listedItem.listed_at),
  };
}

function mapToListEntry(listedItem: ListedMediaResponse) {
  switch (listedItem.type) {
    case 'movie':
      return mapToMovieEntry(
        assertDefined(
          listedItem.movie,
          'Expected movie in ListedMediaResponse',
        ),
      );
    case 'show':
      return mapToShowEntry(
        assertDefined(
          listedItem.show,
          'Expected show in ListedMediaResponse',
        ),
      );
  }
}

export function mapToListItem(
  listedItem: ListedMediaResponse,
) {
  return {
    ...mapListDetails(listedItem),
    entry: mapToListEntry(listedItem),
  };
}
