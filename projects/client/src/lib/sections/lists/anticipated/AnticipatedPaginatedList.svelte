<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  type AnticipatedListProps = {
    title: string;
    type: MediaType;
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
    <AnticipatedListItem {type} {media} {style} />
  {/snippet}

  {#snippet actions()}
    <ShareButton
      {title}
      textFactory={({ title: name }) => m.text_share_top_list({ name })}
      source={{ id: "anticipated", type }}
    />
  {/snippet}
</DrilledMediaList>
