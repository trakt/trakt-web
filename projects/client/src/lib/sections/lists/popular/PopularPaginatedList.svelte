<script lang="ts">
  import { page } from "$app/state";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { decodeRecord } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: DiscoverMode;
  };

  const { title, type }: PopularListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-popular-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    usePopularList({
      ...params,
      search: decodeRecord(page.url.searchParams.get("search") ?? ""),
    })}
>
  {#snippet item(media)}
    <PopularListItem
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
      source={{ id: "popular", type }}
    />
  {/snippet}
</DrilledMediaList>
