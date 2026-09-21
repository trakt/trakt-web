import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import z from 'zod';

const STORAGE_KEY = 'trakt-recent-reactions';
const LIMIT = 5;
const RecentReactionsSchema = z.array(z.string());

const read = (): string[] => {
  try {
    const parsed = RecentReactionsSchema.safeParse(
      JSON.parse(safeLocalStorage.getItem(STORAGE_KEY) ?? '[]'),
    );
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
};

// Recents are per device on purpose: they are a shortcut row, not history,
// so they live in localStorage rather than behind an endpoint.
const recent = new BehaviorSubject<string[]>(read());

export function useRecentReactions() {
  const push = (type: string) => {
    const next = [
      type,
      ...recent.getValue().filter((held) => held !== type),
    ].slice(0, LIMIT);

    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    recent.next(next);
  };

  return {
    recent: recent.asObservable(),
    push,
  };
}
