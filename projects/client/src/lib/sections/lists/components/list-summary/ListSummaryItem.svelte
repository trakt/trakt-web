<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { Snippet } from "svelte";
  import ListSummaryCard from "../ListSummaryCard.svelte";
  import ListHeader from "./_internal/ListHeader.svelte";
  import ListPosters from "./_internal/ListPosters.svelte";

  const {
    list,
    source,
    onclick,
    popupActions,
  }: {
    list: MediaListSummary;
    source?: string;
    onclick?: (list: MediaListSummary) => void;
    popupActions?: Snippet;
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
  <ListHeader {list} onclick={handler} {popupActions} />
  <ListPosters {list} onclick={handler} />
</ListSummaryCard>
