<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import ListHeader from "./_internal/ListHeader.svelte";
  import ListPosters from "./_internal/ListPosters.svelte";

  const { list, type }: { list: MediaListSummary; type: MediaType } = $props();
</script>

<Card
  --width-card="min(var(--width-list-card), 85vw)"
  --height-card="var(--height-list-card)"
>
  <div class="trakt-list-summary">
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

    background-color: color-mix(
      in srgb,
      var(--color-card-background) 40%,
      var(--color-background)
    );
    border-radius: var(--border-radius-m);
  }
</style>
