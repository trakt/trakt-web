<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListSummaryCard from "../ListSummaryCard.svelte";
  import ListHeader from "./_internal/ListHeader.svelte";
  import ListPosters from "./_internal/ListPosters.svelte";

  const {
    list,
    source,
    onclick,
  }: {
    list: MediaListSummary;
    source?: string;
    onclick?: (list: MediaListSummary) => void;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const handler = () => {
    onclick?.(list);

    if (source) {
      track({ source, type: "list" });
    }
  };
</script>

<ListSummaryCard variant={list.type === "official" ? "official" : "default"}>
  <ListHeader {list} onclick={handler} />
  <ListPosters {list} onclick={handler} />
</ListSummaryCard>
