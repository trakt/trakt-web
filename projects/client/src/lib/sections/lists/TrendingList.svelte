<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "./components/MediaItem.svelte";
  import { useTrendingList } from "./stores/useTrendingList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type TrendingListProps = {
    title: string;
    label: string;
    type: MediaType;
  };

  const { title, label, type }: TrendingListProps = $props();

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
        <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
      {/snippet}
    </MediaItem>
  {/snippet}

  {#snippet actions()}
    <Button
      {label}
      href={UrlBuilder.trending({ type })}
      style="flat"
      variant="primary"
      color="purple"
      size="small"
    >
      {m.view_all()}
    </Button>
  {/snippet}
</SectionList>
