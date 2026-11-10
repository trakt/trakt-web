<script lang="ts">
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import type { AwardTally } from "./models/AwardTally.ts";
  import { toAwardSummaryParts } from "./toAwardSummaryParts.ts";

  const {
    tallies,
    isSingleLine = false,
  }: { tallies: ReadonlyArray<AwardTally>; isSingleLine?: boolean } = $props();

  const parts = $derived(toAwardSummaryParts(tallies));
</script>

<p class="trakt-award-summary-line secondary" class:ellipsis={isSingleLine}>
  {#each parts as part, index (part.id)}
    {#if index > 0}
      <span class="summary-separator" aria-hidden="true">·</span>
    {/if}
    <span class="summary-part" data-kind={part.kind}>
      <MessageWithBold message={part.message} />
    </span>
  {/each}
</p>

<style lang="scss">
  .trakt-award-summary-line {
    margin: 0;
    font-size: var(--font-size-text);
    font-weight: 400;

    .summary-separator {
      margin-inline: var(--ni-4);
    }

    .summary-part :global(b) {
      font-weight: inherit;
      color: inherit;
    }

    .summary-part[data-kind="wins"] :global(b),
    .summary-part[data-kind="festival"] :global(b) {
      font-weight: 600;
      color: var(--color-award-gold-text);
    }
  }
</style>
