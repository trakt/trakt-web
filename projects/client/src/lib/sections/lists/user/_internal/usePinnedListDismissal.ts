import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import { map } from 'rxjs';

export function usePinnedListDismissal(userId: string, listId: string) {
  const lists = useClientRecord(ClientStateKey.DismissedPinnedLists);
  const key = `${userId}/${listId}`;

  return {
    dismiss: () => lists.set(key, true),
    isDismissed: lists.entry(key).pipe(map((dismissed) => dismissed === true)),
  };
}
