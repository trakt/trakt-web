<script lang="ts">
  import type { AwardEntry } from "$lib/requests/models/AwardEntry";
  import AwardSpotlight from "./AwardSpotlight.svelte";

  const {
    entries,
    today,
  }: { entries: ReadonlyArray<AwardEntry>; today: Date } = $props();
</script>

<div class="trakt-award-spotlights">
  {#each entries as entry (entry.key)}
    <AwardSpotlight {entry} {today} isWide={entries.length === 1} />
  {/each}
</div>

<style lang="scss">
  .trakt-award-spotlights {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, var(--ni-340)), 1fr)
    );
    gap: var(--gap-m);
    padding-inline: var(--layout-distance-side);
  }
</style>
