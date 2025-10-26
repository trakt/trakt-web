<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListHeader from "./_internal/ListHeader.svelte";
  import ListPosters from "./_internal/ListPosters.svelte";

  const {
    list,
    type,
    isOfficial,
  }: { list: MediaListSummary; type?: DiscoverMode; isOfficial: boolean } =
    $props();
</script>

<Card
  --width-card="min(var(--width-list-card), 85vw)"
  --height-card="var(--height-list-card)"
>
  <div class="trakt-list-summary" class:trakt-list-official={isOfficial}>
    <ListHeader {list} {type} />
    <ListPosters {list} {type} />
  </div>
</Card>

<style>
  .trakt-list-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-12);

    background-color: var(--cm-background-list-summary);
    border-radius: var(--border-radius-m);

    &.trakt-list-official {
      background-color: var(--cm-background-official-list-summary);
    }
  }
</style>
