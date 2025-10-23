<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
    title: string;
    type: DiscoverMode;
  };

  const { title, type }: AnticipatedListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-anticipated-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={useAnticipatedList}
>
  {#snippet item(media)}
    <AnticipatedListItem
      type={media.type}
      {media}
      {style}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}

  {#snippet actions()}
    <ShareButton
      {title}
      textFactory={({ title: name }) => m.text_share_top_list({ name })}
      source={{ id: "anticipated", type }}
    />
  {/snippet}
</DrilledMediaList>
