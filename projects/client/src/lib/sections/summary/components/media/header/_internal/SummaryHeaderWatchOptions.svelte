<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { HeaderProvider } from "./HeaderProvider.ts";
  import SummaryHeaderProviderRow from "./SummaryHeaderProviderRow.svelte";

  /*
    The vertical provider list, borderless in both directions: rows are separated
    by their own height rather than by rules, which is what makes the list read as
    smooth rather than as a table.

    There is no "all options" footer - the section header's chevron already goes to
    the same place, and two affordances for one destination is just noise.

    Rows share the strip's grid: `--summary-header-row-height` and
    `--summary-header-tile`, 44px unless a caller tightens them.

    Empty state keeps the section and says so: a title with no provider is
    information, not a reason to hide the list.
  */
  const {
    providers,
    country,
  }: {
    providers: ReadonlyArray<HeaderProvider>;
    country: string;
  } = $props();
</script>

<div class="trakt-summary-header-watch-options">
  {#if providers.length === 0}
    <p class="watch-options-empty secondary">
      {m.text_not_available_to_stream()}
    </p>
  {:else}
    <div class="watch-options-list">
      {#each providers as provider (provider.key)}
        <SummaryHeaderProviderRow
          service={provider.service}
          planCount={provider.planCount}
          {country}
        />
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-summary-header-watch-options {
    display: flex;
    flex-direction: column;

    width: 100%;
  }

  .watch-options-list {
    display: flex;
    flex-direction: column;
    gap: var(--summary-header-row-gap, var(--ni-12));
  }

  .watch-options-empty {
    font-size: var(--font-size-text);
  }
</style>
