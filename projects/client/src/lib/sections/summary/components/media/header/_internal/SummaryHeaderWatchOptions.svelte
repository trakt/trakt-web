<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import SummaryHeaderProviderRow from "./SummaryHeaderProviderRow.svelte";

  /*
    The vertical provider list, borderless in both directions: rows are separated
    by their own height rather than by rules, which is what makes the list read as
    smooth rather than as a table.

    There is no "all options" footer - the section header's chevron already goes to
    the same place, and two affordances for one destination is just noise.

    Row and logo size come from `--provider-row-height` / `--provider-logo-column`,
    so a caller can tighten the list without a variant flag.

    Empty state keeps the section and says so: a title with no provider is
    information, not a reason to hide the list.
  */
  const {
    providers,
    country,
  }: {
    providers: ReadonlyArray<StreamingServiceOption>;
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
        <SummaryHeaderProviderRow service={provider} {country} />
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
  }

  .watch-options-empty {
    font-size: var(--font-size-text);
  }
</style>
