<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListHeader from "./_internal/ListHeader.svelte";
  import ListPosters from "./_internal/ListPosters.svelte";

  const {
    list,
    type,
    source,
    onclick,
  }: {
    list: MediaListSummary;
    type?: DiscoverMode;
    source?: string;
    onclick?: (list: MediaListSummary) => void;
  } = $props();

  const handler = () => {
    onclick?.(list);
  };
</script>

<Card
  --width-card="min(var(--width-list-card), 85vw)"
  --height-card="var(--height-list-card)"
>
  <div
    class="trakt-list-summary"
    class:trakt-list-official={list.type === "official"}
  >
    <ListHeader {list} {type} {source} onclick={handler} />
    <ListPosters {list} {type} {source} onclick={handler} />
  </div>
</Card>

<style>
  .trakt-list-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--ni-12);

    background-color: color-mix(
      in srgb,
      var(--color-card-background) 40%,
      var(--color-background)
    );
    border-radius: var(--border-radius-m);

    &.trakt-list-official {
      background-color: color-mix(
        in srgb,
        var(--color-official-list-background) 40%,
        var(--color-background)
      );
    }
  }
</style>
