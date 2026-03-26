<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import type { ImportCounts } from "../../import/ImportTypes.ts";

  const {
    counts,
    isVipLimitExceeded,
    totalItems,
    onstart,
    onreset,
  }: {
    counts: ImportCounts;
    isVipLimitExceeded: boolean;
    totalItems: number;
    onstart: () => void;
    onreset: () => void;
  } = $props();
</script>

<div class="import-summary">
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

<style lang="scss">
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
