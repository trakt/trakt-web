<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { slide } from "svelte/transition";
  import type { ImportCounts } from "../../import/ImportTypes.ts";

  type ImportSummaryProps = {
    counts: ImportCounts;
    totalItems: number;
    onstart: () => void;
    onreset: () => void;
  };

  const { counts, totalItems, onstart, onreset }: ImportSummaryProps = $props();

  const { user, limits } = useUser();

  const isVipLimitExceeded = $derived.by(() => {
    if ($user?.isVip) return false;
    if (!$limits) return false;

    const watchlistFreeLimit = $limits.watchlistItems.free;
    const historyFreeLimit = $limits.history.free;

    return (
      counts.watchlist > watchlistFreeLimit || counts.history > historyFreeLimit
    );
  });
</script>

<div class="import-summary" transition:slide={{ duration: 150, axis: "y" }}>
  <div class="import-summary-counts">
    {#if counts.history > 0}
      <p class="secondary">
        {m.import_summary_history({ count: counts.history })}
      </p>
    {/if}
    {#if counts.watchlist > 0}
      <p class="secondary">
        {m.import_summary_watchlist({ count: counts.watchlist })}
      </p>
    {/if}
    {#if counts.ratings > 0}
      <p class="secondary">
        {m.import_summary_ratings({ count: counts.ratings })}
      </p>
    {/if}
  </div>

  {#if isVipLimitExceeded}
    <UpsellCta source="import" variant="small">
      {m.import_vip_limit_exceeded({ count: totalItems })}
    </UpsellCta>
  {/if}

  <div class="import-summary-actions">
    <Button
      label={m.button_label_start_import()}
      disabled={isVipLimitExceeded || totalItems === 0}
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
  .import-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .import-summary-counts {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-summary-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
