import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import { userNotesNotesQuery } from '../../../../../requests/queries/users/userNotesQuery.ts';

type UseNotesProps = {
  media: MediaEntry;
};

export function useNotes({ media }: UseNotesProps) {
  const query = useQuery(
    userNotesNotesQuery({ type: media.type, slug: media.slug }),
  );

  return {
    notes: query.pipe(
      map(($query) =>
        ($query.data ?? [])
          .toSorted((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      ),
    ),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
