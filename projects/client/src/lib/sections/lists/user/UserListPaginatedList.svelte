<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaCard from "../components/MediaCard.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useListItems, type ListParams } from "./useListItems";

  type UserListProps = {
    title: string;
    type?: MediaType;
    list: ListParams;
  };

  const { title, type, list }: UserListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");

  const listCacheId = $derived.by(() => {
    if (list.user?.slug) {
      return `${list.user.slug}-${list.slug}`;
    }

    return `${list.id}`;
  });
</script>

<DrilledMediaList
  id={`userlist-list-${listCacheId}`}
  {title}
  {type}
  useList={(params) => useListItems({ list, ...params })}
>
  {#snippet item(media)}
    <MediaCard type={media.type} media={media.entry} {style} />
  {/snippet}

  {#snippet badge()}
    <Preview />
  {/snippet}
</DrilledMediaList>
