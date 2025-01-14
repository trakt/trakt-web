<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import MediaItem from "./components/MediaItem.svelte";
  import { useTrendingList } from "./stores/useTrendingList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type TrendingListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: TrendingListProps = $props();

  const { list } = useTrendingList({ type });
</script>

<SectionList
  id={`trending-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media}>
      {#snippet tags()}
        <WatchersTag>{m.active_watchers({ count: media.watchers })}</WatchersTag
        >
      {/snippet}
    </MediaItem>
  {/snippet}
</SectionList>
