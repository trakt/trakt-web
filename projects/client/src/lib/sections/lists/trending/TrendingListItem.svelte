<script lang="ts">
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { TrendingEntry } from "./useTrendingList";

  const { type, media, style, mode }: MediaCardProps<TrendingEntry> = $props();
</script>

{#snippet tag()}
  {#if mode === "mixed"}
    <MediaIconTag mediaType={media.type} />
  {/if}

  <WatchersTag i18n={TagIntlProvider} watchers={media.watchers} />
{/snippet}

<DefaultMediaItem
  {type}
  {media}
  {tag}
  {style}
  source="trending"
  canDeemphasize
/>
