<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchersTag from "$lib/components/media/tags/WatchersTag.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { TrendingEntry } from "./useTrendingList";

  const { type, media, style }: MediaCardProps<TrendingEntry> = $props();

  const isSummary = $derived(style === "summary");
</script>

{#snippet tag()}
  <WatchersTag
    i18n={TagIntlProvider}
    watchers={media.watchers}
    isTextOnly={isSummary}
  />
{/snippet}

<DefaultMediaItem
  {type}
  {media}
  {tag}
  {style}
  source="trending"
  canDeemphasize
/>
