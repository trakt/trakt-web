<script lang="ts">
  import SummaryHeaderStatePill from "./SummaryHeaderStatePill.svelte";
  import type { RecapStanding } from "./toRecapStanding.ts";

  /*
    The viewer's standing, as one row: the state as a pill, and beside it the
    time left when there is catching up to do. Shared so the header strip's
    subline and the recap drawer say it identically - it is the same fact, and
    the drawer is where the reader goes for more of it, not for a different
    version of it.
  */
  const { standing }: { standing: RecapStanding } = $props();
</script>

<div class="trakt-summary-header-standing">
  <SummaryHeaderStatePill label={standing.label} tone={standing.tone} />

  {#if standing.timeLeft}
    <span class="standing-note">{standing.timeLeft}</span>
  {/if}
</div>

<style lang="scss">
  .trakt-summary-header-standing {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
  }

  /*
    Sized on the span itself: the global typography sheet sizes every bare
    span to body text with an element selector, which beats anything inherited
    from this row.
  */
  .standing-note {
    font-size: var(--font-size-text-small);
    font-weight: 400;
    color: var(--color-text-quiet);
    white-space: nowrap;
  }
</style>
