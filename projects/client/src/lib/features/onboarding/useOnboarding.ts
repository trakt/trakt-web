import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import {
  asapScheduler,
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  merge,
  type Observable,
  observeOn,
  share,
  tap,
  withLatestFrom,
} from 'rxjs';
import { onboardingBaselineStore } from './_internal/onboardingBaselineStore.ts';
import { onboardingReplayRequests } from './_internal/onboardingReplayRequests.ts';
import { onboardingUiStore } from './_internal/onboardingUiStore.ts';
import { selectActiveSet } from './_internal/selectActiveSet.ts';
import { toAccountWrites } from './_internal/toAccountWrites.ts';
import { toActiveOnboarding } from './_internal/toActiveOnboarding.ts';
import { useOnboardingCounts } from './_internal/useOnboardingCounts.ts';
import { useOnboardingProgress } from './_internal/useOnboardingProgress.ts';
import { watchOnboardingActivity } from './_internal/watchOnboardingActivity.ts';
import type { ActiveOnboarding } from './models/ActiveOnboarding.ts';
import type { OnboardingActions } from './models/OnboardingActions.ts';
import type { OnboardingRecordChange } from './models/OnboardingRecordChange.ts';
import type { OnboardingSetProgress } from './models/OnboardingSetProgress.ts';
import type { OnboardingSetRecord } from './models/OnboardingSetRecord.ts';
import { onboardingCatalog } from './onboardingCatalog.ts';

function countSkipped(record: OnboardingSetRecord): number {
  return Object.values(record.steps).filter(
    ({ status }) => status === 'skipped',
  ).length;
}

export function useOnboarding() {
  const { user } = useUser();
  const progress = useOnboardingProgress();
  const trackOpen = useTrack(AnalyticsEvent.GettingStartedOpen).track;
  const trackTrack = useTrack(AnalyticsEvent.GettingStartedTrack).track;
  const trackUntrack = useTrack(AnalyticsEvent.GettingStartedUntrack).track;
  const trackSkip = useTrack(AnalyticsEvent.GettingStartedSkip).track;
  const trackStep = useTrack(AnalyticsEvent.GettingStartedStep).track;
  const trackComplete = useTrack(AnalyticsEvent.GettingStartedComplete).track;
  const trackRetire = useTrack(AnalyticsEvent.GettingStartedRetire).track;
  const loadedAt = Date.now();
  const shown = new BehaviorSubject<OnboardingSetProgress | null>(null);

  const report = (
    setId: string,
    change: OnboardingRecordChange,
    record: OnboardingSetRecord,
  ) => {
    if (change.type === 'done') {
      trackStep({ set: setId, step: change.stepId, source: change.source });
    }
    if (change.type === 'complete') {
      trackComplete({ set: setId, skipped: countSkipped(record) });
    }
    if (change.type === 'retire') trackRetire({ set: setId });
  };

  const apply = (setId: string, change: OnboardingRecordChange): boolean => {
    const record = progress.apply(setId, change);
    if (!record) return false;

    report(setId, change, record);
    return true;
  };

  const actions: OnboardingActions = {
    skip: ({ setId, stepId }) => {
      if (!apply(setId, { type: 'skip', stepId })) return;
      trackSkip({ set: setId, step: stepId, action: 'skip' });
    },
    unskip: ({ setId, stepId }) => {
      if (!apply(setId, { type: 'unskip', stepId })) return;
      trackSkip({ set: setId, step: stepId, action: 'undo' });
    },
    track: ({ setId, stepId }) => {
      if (!apply(setId, { type: 'track', stepId })) return;
      trackTrack({ set: setId, step: stepId });
    },
    untrack: ({ setId, stepId }) => {
      if (!apply(setId, { type: 'track', stepId: null })) return;
      if (stepId) trackUntrack({ set: setId, step: stepId });
    },
    clearTracked: ({ setId }) => {
      apply(setId, { type: 'track', stepId: null });
    },
    dismiss: ({ setId }) => {
      onboardingUiStore.dismiss(setId);
    },
  };

  watchOnboardingActivity({
    client: useQueryClient(),
    sets: onboardingCatalog,
    onAction: ({ setId, stepId }) =>
      apply(setId, { type: 'done', stepId, source: 'action' }),
  });

  const userId = user.pipe(
    map(($user) => $user.id),
    distinctUntilChanged(),
  );

  const { raw: rawCounts, counts } = useOnboardingCounts({
    catalog: onboardingCatalog,
    userId,
  });

  const selection = combineLatest([
    progress.records,
    counts,
    user,
    onboardingUiStore.dismissedSetId,
  ]).pipe(
    map(([records, $counts, $user, $dismissedSetId]) =>
      selectActiveSet({
        catalog: onboardingCatalog,
        records,
        counts: $counts,
        user: $user,
        now: Date.now(),
        loadedAt,
        dismissedSetId: $dismissedSetId,
        bypassesEligibility: $user.isDirector,
      }),
    ),
    share(),
  );

  const accountWrites = selection.pipe(
    map(toAccountWrites),
    filter((writes) => writes.length > 0),
    observeOn(asapScheduler),
    tap((writes) =>
      writes.forEach(({ setId, change }) => apply(setId, change)),
    ),
    ignoreElements(),
  );

  const replays = onboardingReplayRequests.pipe(
    withLatestFrom(userId, rawCounts),
    tap(([, $userId, $counts]) => {
      onboardingBaselineStore.set($userId, $counts);
      progress.reset(onboardingCatalog.map(({ id }) => id));
    }),
    ignoreElements(),
  );

  const active: Observable<ActiveOnboarding | null> = merge(
    selection.pipe(
      map(({ active: current }) =>
        current ? toActiveOnboarding({ progress: current, actions }) : null,
      ),
      tap((current) => shown.next(current?.progress ?? null)),
    ),
    accountWrites,
    replays,
  );

  const openDrawer = () => {
    const current = shown.value;
    if (current) {
      trackOpen({
        set: current.set.id,
        done: current.done,
        total: current.total,
      });
    }
    onboardingUiStore.open();
  };

  return {
    active,
    isDrawerOpen: onboardingUiStore.isOpen,
    openDrawer,
    closeDrawer: onboardingUiStore.close,
    trackerGlyph: onboardingUiStore.trackerGlyph,
    setTrackerGlyph: onboardingUiStore.setTrackerGlyph,
  };
}
