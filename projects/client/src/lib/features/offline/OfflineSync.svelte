<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { distinctUntilChanged, filter, pairwise } from "rxjs";
  import { onMount } from "svelte";
  import { offlineActionsStore } from "./_internal/offlineActionsStore.ts";
  import { onlineStatusStore } from "./_internal/onlineStatusStore.ts";
  import {
    replayOfflineActions,
    type ReplayOutcome,
  } from "./_internal/replayOfflineActions.ts";
  import type { OfflineAction } from "./models/OfflineAction.ts";
  import { time } from "$lib/utils/timing/time.ts";

  const NOTICE_DURATION_MS = time.seconds(6);
  const QUEUED_NOTICE_WINDOW_MS = time.seconds(10);

  type Notice =
    | { kind: "queued" }
    | { kind: "synced"; count: number }
    | { kind: "failed"; count: number };

  const { invalidateAll } = useInvalidator();

  let notice = $state<Notice | null>(null);
  let duplicates = $state<OfflineAction[]>([]);
  let isReplaying = false;

  const applyOutcome = async (outcome: ReplayOutcome) => {
    await offlineActionsStore.remove([
      ...outcome.executedIds,
      ...outcome.failedIds,
    ]);

    if (outcome.invalidations.length > 0) {
      await invalidateAll(outcome.invalidations);
    }

    if (outcome.failedIds.length > 0) {
      notice = { kind: "failed", count: outcome.failedIds.length };
      return;
    }

    if (outcome.executedIds.length > 0) {
      notice = { kind: "synced", count: outcome.executedIds.length };
    }
  };

  const replay = async () => {
    await offlineActionsStore.refresh();
    const actions = offlineActionsStore.current();

    if (actions.length === 0) {
      return;
    }

    const outcome = await replayOfflineActions({ actions });
    await applyOutcome(outcome);
    duplicates = outcome.duplicates;
  };

  // The web lock keeps two tabs from replaying the same queue at once; the
  // losing tab skips and picks up whatever is left on its next trigger.
  const withReplayLock = async (task: () => Promise<void>) => {
    if (!navigator.locks) {
      await task();
      return;
    }

    await navigator.locks.request(
      "trakt-offline-replay",
      { ifAvailable: true },
      async (lock) => {
        if (lock) {
          await task();
        }
      },
    );
  };

  const runReplay = async () => {
    if (isReplaying) {
      return;
    }

    isReplaying = true;

    try {
      await withReplayLock(replay);
    } finally {
      isReplaying = false;
    }
  };

  const syncDuplicatesAnyway = async () => {
    const approved = duplicates;
    duplicates = [];

    const outcome = await replayOfflineActions({
      actions: approved,
      reconcile: false,
    });
    await applyOutcome(outcome);
  };

  const skipDuplicates = async () => {
    const skipped = duplicates;
    duplicates = [];

    await offlineActionsStore.remove(skipped.map(({ id }) => id));
  };

  onMount(() => {
    const replayTrigger = onlineStatusStore.isOnline$
      .pipe(distinctUntilChanged(), filter(Boolean))
      .subscribe(() => void runReplay());

    const queuedNotice = offlineActionsStore.actions$
      .pipe(pairwise())
      .subscribe(([previous, next]) => {
        if (next.length <= previous.length) {
          return;
        }

        // IDB hydration also grows the queue; only a just-queued action
        // should toast, not actions restored from a previous session.
        const latest = next.at(-1);
        const isRecent = latest &&
          Date.now() - latest.queuedAt < QUEUED_NOTICE_WINDOW_MS;

        if (isRecent) {
          notice = { kind: "queued" };
        }
      });

    return () => {
      replayTrigger.unsubscribe();
      queuedNotice.unsubscribe();
    };
  });

  const noticeContent = $derived.by(() => {
    if (!notice) {
      return null;
    }

    switch (notice.kind) {
      case "queued":
        return {
          title: m.text_offline_queued_title(),
          message: m.text_offline_queued_message(),
          variant: "default" as const,
        };
      case "synced":
        return {
          title: m.text_offline_synced_title(),
          message:
            notice.count === 1
              ? m.text_offline_synced_message_one()
              : m.text_offline_synced_message_other({ count: notice.count }),
          variant: "default" as const,
        };
      case "failed":
        return {
          title: m.text_offline_sync_failed_title(),
          message:
            notice.count === 1
              ? m.text_offline_sync_failed_message_one()
              : m.text_offline_sync_failed_message_other({
                  count: notice.count,
                }),
          variant: "error" as const,
        };
    }
  });
</script>

{#if duplicates.length > 0}
  <Snackbar
    open
    title={m.text_offline_duplicate_title()}
    message={duplicates.length === 1
      ? m.text_offline_duplicate_message_one()
      : m.text_offline_duplicate_message_other({ count: duplicates.length })}
    action={{
      text: m.button_text_sync_anyway(),
      label: m.button_label_sync_anyway(),
      onAction: () => void syncDuplicatesAnyway(),
    }}
    onDismiss={() => void skipDuplicates()}
  />
{:else if noticeContent}
  <Snackbar
    open
    title={noticeContent.title}
    message={noticeContent.message}
    variant={noticeContent.variant}
    dismissDurationMs={NOTICE_DURATION_MS}
    onDismiss={() => (notice = null)}
  />
{/if}
