<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListSummaryCard from "../ListSummaryCard.svelte";
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

<ListSummaryCard variant={list.type === "official" ? "official" : "default"}>
  <ListHeader {list} {type} {source} onclick={handler} />
  <ListPosters {list} {type} {source} onclick={handler} />
</ListSummaryCard>
