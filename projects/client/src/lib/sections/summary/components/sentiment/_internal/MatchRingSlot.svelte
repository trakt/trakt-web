<script lang="ts">
  import type { MatchKind } from "$lib/requests/models/MatchKind.ts";
  import MatchOrbit from "./MatchOrbit.svelte";
  import MatchRingSkeleton from "./MatchRingSkeleton.svelte";

  const {
    score,
    kind,
    isLoading,
  }: { score: number | null; kind: MatchKind; isLoading: boolean } = $props();
</script>

<div class="trakt-match-ring-slot">
  {#if isLoading}
    <MatchRingSkeleton />
  {:else}
    <MatchOrbit {score} {kind} />
  {/if}
</div>

<style>
  .trakt-match-ring-slot {
    display: flex;
    justify-content: center;

    width: var(--width-sentiment-match-slot);

    :global(.trakt-match-ring-skeleton) {
      width: var(--ni-56);
      height: var(--ni-56);
    }
  }
</style>
