import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import { map } from 'rxjs';

export function useReelSeen(year: number) {
  const years = useClientRecord(ClientStateKey.YirReelSeen);
  const key = String(year);

  return {
    isSeen: years.entry(key).pipe(map((seen) => seen === true)),
    markSeen: () => years.set(key, true),
  };
}
