import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { z } from 'zod';
import { getTodayWindow } from './_internal/getTodayWindow.ts';

const TODAY_SEEN_STORAGE_KEY = 'today-seen-stories';

const SeenStoriesSchema = z.record(z.string(), z.number());
type SeenStories = z.infer<typeof SeenStoriesSchema>;

function withinWindow(seen: SeenStories, now: Date): SeenStories {
  const { start } = getTodayWindow(now);
  return Object.fromEntries(
    Object.entries(seen).filter(([, seenAt]) => seenAt >= start.getTime()),
  );
}

function readSeenStories(): SeenStories {
  try {
    const stored = SeenStoriesSchema.safeParse(
      JSON.parse(safeLocalStorage.getItem(TODAY_SEEN_STORAGE_KEY) ?? 'null'),
    );
    return stored.success ? withinWindow(stored.data, new Date()) : {};
  } catch {
    return {};
  }
}

let seenStories: BehaviorSubject<SeenStories> | null = null;

function getSeenStories() {
  seenStories ??= new BehaviorSubject<SeenStories>(readSeenStories());
  return seenStories;
}

export function useTodaySeenStories() {
  const seen = getSeenStories();

  const markSeen = (key: string) => {
    const now = new Date();
    const next = { ...withinWindow(seen.value, now), [key]: now.getTime() };
    safeLocalStorage.setItem(TODAY_SEEN_STORAGE_KEY, JSON.stringify(next));
    seen.next(next);
  };

  return {
    seenStories: seen.asObservable(),
    markSeen,
  };
}
