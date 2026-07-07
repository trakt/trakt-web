<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { slide } from "svelte/transition";
  import type {
    ImportAction,
    ImportActionSelection,
    ImportCounts,
    ImportSource,
  } from "../../import/ImportTypes.ts";

  type ImportSummaryProps = {
    counts: ImportCounts;
    selectedActions: ImportActionSelection;
    source: ImportSource;
    onactionchange: (action: ImportAction, isIncluded: boolean) => void;
    onstart: () => void;
    onreset: () => void;
  };

  const {
    counts,
    selectedActions,
    source,
    onactionchange,
    onstart,
    onreset,
  }: ImportSummaryProps = $props();

  const { user, limits } = useUser();

  const selectedCounts = $derived<ImportCounts>({
    history: selectedActions.history ? counts.history : 0,
    watchlist: selectedActions.watchlist ? counts.watchlist : 0,
    ratings: selectedActions.ratings ? counts.ratings : 0,
    list: selectedActions.list ? counts.list : 0,
  });
  const selectedTotalItems = $derived(
    selectedCounts.history + selectedCounts.watchlist +
      selectedCounts.ratings + selectedCounts.list,
  );

  const actionRows = $derived<
    ReadonlyArray<{
      action: ImportAction;
      count: number;
      label: (inputs: { count: number }) => string;
    }>
  >([
    { action: "history", count: counts.history, label: m.import_summary_history },
    {
      action: "watchlist",
      count: counts.watchlist,
      label: m.import_summary_watchlist,
    },
    { action: "ratings", count: counts.ratings, label: m.import_summary_ratings },
    { action: "list", count: counts.list, label: m.import_summary_list },
  ]);

  const isVipLimitExceeded = $derived.by(() => {
    if ($user?.isVip) return false;
    if (!$limits) return false;

    // FIXME: revert when limits are changed
    const limitMultiplier = source === "tvtime" ? 2 : 1;
    const watchlistFreeLimit = $limits.watchlistItems.free * limitMultiplier;
    const historyFreeLimit = $limits.history.free * limitMultiplier;
    const listItemsFreeLimit = $limits.totalListItems.free * limitMultiplier;

    return (
      selectedCounts.watchlist > watchlistFreeLimit ||
      selectedCounts.history > historyFreeLimit ||
      selectedCounts.list > listItemsFreeLimit
    );
  });
</script>

<div
  class="trakt-import-summary"
  transition:slide={{ duration: 150, axis: "y" }}
>
  <div class="import-summary-counts">
    {#each actionRows as { action, count, label } (action)}
      {#if count > 0}
        <div
          class="import-summary-action"
          data-included={selectedActions[action] ? "true" : "false"}
        >
          <span class="import-summary-switch">
            <Switch
              label={label({ count })}
              checked={selectedActions[action]}
              onclick={() => onactionchange(action, !selectedActions[action])}
            />
          </span>
          <p class="secondary" aria-hidden="true">
            {label({ count })}
          </p>
        </div>
      {/if}
    {/each}
  </div>

  {#if isVipLimitExceeded}
    <UpsellCta source="import" variant="small">
      {m.import_vip_limit_exceeded({ count: selectedTotalItems })}
    </UpsellCta>
  {/if}

  <div class="import-summary-actions">
    <Button
      label={m.button_label_start_import()}
      disabled={isVipLimitExceeded || selectedTotalItems === 0}
      onclick={onstart}
      color="purple"
      size="small"
    >
      {m.button_text_start_import()}
    </Button>
    <Button
      label={m.button_label_cancel()}
      onclick={onreset}
      color="default"
      size="small"
    >
      {m.button_text_cancel()}
    </Button>
  </div>
</div>

<style>
  .trakt-import-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .import-summary-counts {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-summary-action {
    display: grid;
    grid-template-columns: var(--ni-44) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-xs);

    p {
      transition:
        opacity var(--transition-increment) ease-in-out,
        text-decoration-color var(--transition-increment) ease-in-out;
    }

    &[data-included="false"] {
      p {
        opacity: 0.55;
        text-decoration: line-through;
        text-decoration-color: currentColor;
      }
    }
  }

  .import-summary-switch {
    display: flex;
    align-items: center;
    inline-size: var(--ni-44);

    :global(.trakt-switch) {
      --button-width: var(--ni-44);
      --button-height: var(--ni-20);
      --tick-size: var(--ni-14);
      --tick-offset: var(--ni-3);
    }
  }

  .import-summary-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
