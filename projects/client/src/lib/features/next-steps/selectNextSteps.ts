import { chunk } from '$lib/utils/array/chunk.ts';
import type { NextStep } from './NextStep.ts';
import { NextStepId } from './NextStepId.ts';
import type { NextStepSignals } from './NextStepSignals.ts';
import type { NextStepsPage } from './NextStepsPage.ts';

const PAGE_SIZE = 3;
const WATCHLIST_GOAL = 3;

type PoolEntry = {
  id: NextStepId;
  isDone: (signals: NextStepSignals) => boolean;
};

const POOL: ReadonlyArray<PoolEntry> = [
  { id: NextStepId.WatchHistory, isDone: (s) => s.watchedCount > 0 },
  {
    id: NextStepId.Watchlist,
    isDone: (s) => s.watchlistCount >= WATCHLIST_GOAL,
  },
  { id: NextStepId.Rate, isDone: (s) => s.ratingsCount > 0 },
  { id: NextStepId.FavoriteGenres, isDone: (s) => s.lovedGenresCount > 0 },
  {
    id: NextStepId.FavoriteServices,
    isDone: (s) => s.favoriteServicesCount > 0,
  },
  {
    id: NextStepId.StreamingSync,
    isDone: (s) => s.streamingConnectionsCount > 0,
  },
  { id: NextStepId.Follow, isDone: (s) => s.followingCount > 0 },
  { id: NextStepId.CreateList, isDone: (s) => s.listsCount > 0 },
  { id: NextStepId.Comment, isDone: (s) => s.commentsCount > 0 },
];

function toPage(steps: ReadonlyArray<NextStep>): NextStepsPage {
  return {
    steps,
    completed: steps.filter((step) => step.isDone).length,
    total: steps.length,
  };
}

/**
 * Drops skipped steps, splits the rest of the priority-ordered pool into pages
 * of three and returns the first page that still has something left to do.
 * Completed steps stay on their page (ticked) until the whole page is done,
 * so progress reads as 1/3, 2/3, then the next page. A skip is never progress:
 * the next step simply takes its place. Returns `null` once nothing is left.
 */
export function selectNextSteps(
  signals: NextStepSignals,
  skipped: ReadonlyArray<NextStepId> = [],
): NextStepsPage | null {
  const steps = POOL
    .filter(({ id }) => !skipped.includes(id))
    .map(({ id, isDone }) => ({ id, isDone: isDone(signals) }));
  const current = chunk(steps, PAGE_SIZE)
    .find((page) => page.some((step) => !step.isDone));

  return current ? toPage(current) : null;
}
