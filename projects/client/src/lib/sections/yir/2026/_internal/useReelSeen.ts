import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';

const LOCAL_STORAGE_KEY = 'trakt-yir-reel-seen';

function readSeenYears(): ReadonlyArray<number> {
  try {
    const parsed: unknown = JSON.parse(
      safeLocalStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]',
    );
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function useReelSeen(year: number) {
  const seenYears = new BehaviorSubject(readSeenYears());

  const markSeen = () => {
    if (seenYears.value.includes(year)) return;

    const next = [...seenYears.value, year];
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    seenYears.next(next);
  };

  return {
    isSeen: seenYears.pipe(map(($years) => $years.includes(year))),
    markSeen,
  };
}
