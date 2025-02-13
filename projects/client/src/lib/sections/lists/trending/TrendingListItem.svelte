<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { TrendingEntry } from "./useTrendingList";

  const { type, media, style }: MediaCardProps<TrendingEntry> = $props();
</script>

{#snippet tags()}
  <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
{/snippet}

<MediaCard {type} {media} {tags} {style} />
