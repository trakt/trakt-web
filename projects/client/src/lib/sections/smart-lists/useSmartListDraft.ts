import { useQuery } from '$lib/features/query/useQuery.ts';
import { smartListDraftQuery } from '$lib/requests/queries/users/smartListDraftQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, of } from 'rxjs';

type UseSmartListDraftProps = {
  userId: string;
  listId: string | undefined;
};

export function useSmartListDraft({ userId, listId }: UseSmartListDraftProps) {
  if (!listId) {
    return {
      draft: of(undefined),
      isLoading: of(false),
    };
  }

  const query = useQuery(smartListDraftQuery({ userId, listId }));

  return {
    draft: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
