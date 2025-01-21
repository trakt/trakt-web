<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { TrendingMediaItem } from "./useTrendingList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<TrendingMediaItem> & MediaStyleProps = $props();
</script>

{#snippet tags()}
  <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
{/snippet}

<MediaItem {type} {media} {tags} {style} />
