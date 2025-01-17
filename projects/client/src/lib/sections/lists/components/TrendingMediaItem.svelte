<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import type { TrendingMediaItem } from "../stores/useTrendingList";
  import MediaItem from "./MediaItem.svelte";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media }: MediaItemProps<TrendingMediaItem> = $props();
</script>

<MediaItem {type} {media}>
  {#snippet tags()}
    <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
  {/snippet}
</MediaItem>
