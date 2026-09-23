import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { z } from 'zod';

/**
 * The reactions this viewer reached for last, newest first.
 *
 * Nine sentiments is a lot to scan for someone who reaches for the same two,
 * so the picker leads with these. Persisted: a "recently used" row that
 * forgets on reload is just a slower way to show nothing.
 *
 * One subject for the whole app, not one per component: the summary page shows
 * the badge on desktop and on mobile, and a per-instance subject would leave
 * one of them showing a stale row after the other recorded a pick.
 */
const STORAGE_KEY = 'trakt-recent-reactions';
const LIMIT = 4;

/* Anything unparseable is dropped rather than trusted: the row is cosmetic,
   and a renamed sentiment must not break the picker for good. */
function readStored(): ReactionSentiment[] {
  const stored = safeLocalStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed = z
    .array(ReactionSentimentSchema)
    .safeParse(JSON.parse(stored));

  return parsed.success ? parsed.data.slice(0, LIMIT) : [];
}

function readSafely(): ReactionSentiment[] {
  try {
    return readStored();
  } catch {
    return [];
  }
}

const recent = new BehaviorSubject<ReactionSentiment[]>(readSafely());

export const recentReactionsStore = {
  recent: recent.asObservable(),
  remember: (sentiment: ReactionSentiment) => {
    const next = [
      sentiment,
      ...recent.value.filter((entry) => entry !== sentiment),
    ].slice(0, LIMIT);

    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    recent.next(next);
  },
};
