<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { clearWatchlist } from "$lib/sections/settings/sync/clearWatchlist.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { slide } from "svelte/transition";
  import type { SyncState } from "../sync/models/SyncState.ts";
  import SyncProgress from "./components/SyncProgress.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const { watchlist } = useUser();
  const { invalidate } = useInvalidator();
  const { confirm } = useConfirm();

  type ClearStatus = "idle" | "clearing" | "done";

  const state = $state<SyncState<ClearStatus>>({
    status: "idle",
    processedCount: 0,
    totalCount: 0,
  });

  const isClearing = $derived(state.status === "clearing");

  async function startClearWatchlist() {
    if (!$watchlist) return;

    state.status = "clearing";
    state.processedCount = 0;
    state.totalCount = $watchlist.movies.size + $watchlist.shows.size;

    await clearWatchlist($watchlist, {
      onProgress: (n) => {
        state.processedCount = n;
      },
      onError: (message) => {
        console.error(message);
      },
      onComplete: async (success) => {
        if (!success) return;

        await invalidate(InvalidateAction.Watchlisted("movie"));
        await invalidate(InvalidateAction.Watchlisted("show"));
        state.status = "done";
      },
    });
  }

  function reset() {
    state.status = "idle";
    state.processedCount = 0;
    state.totalCount = 0;
  }
</script>

<NavigationGuard
  isActive={isClearing}
  confirmationParams={{ type: ConfirmationType.CancelReset }}
  onreset={reset}
>
  <SettingsBlock
    title={m.header_clear_data()}
    description={m.description_clear_data()}
  >
    <div class="trakt-reset-watchlist">
      <SettingsRow title={m.text_clear_watchlist()}>
        <div class="trakt-reset-watchlist-row">
          <Button
            label={m.button_label_clear_watchlist()}
            color="red"
            size="small"
            onclick={confirm({
              type: ConfirmationType.ClearWatchlist,
              onConfirm: startClearWatchlist,
            })}
          >
            {m.button_text_clear_watchlist()}
          </Button>

          {#if state.status === "done"}
            <p
              class="secondary italic"
              transition:slide={{ duration: 150, axis: "y" }}
            >
              {m.reset_status_cleared()}
            </p>
          {/if}
        </div>
      </SettingsRow>
      {#if isClearing}
        <div transition:slide={{ duration: 150, axis: "y" }}>
          <SyncProgress
            processedCount={state.processedCount}
            totalCount={state.totalCount}
            label={m.reset_status_clearing({
              processed: state.processedCount,
              total: state.totalCount,
            })}
          />
        </div>
      {/if}
    </div>
  </SettingsBlock>
</NavigationGuard>

<style>
  .trakt-reset-watchlist {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-reset-watchlist-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
