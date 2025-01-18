<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import ListMediaItem from "$lib/sections/navbar/components/search/ListMediaItem.svelte";
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { RecommendedMediaItem } from "./useRecommendedList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<RecommendedMediaItem> & MediaStyleProps = $props();
</script>

{#if style === "card"}
  <MediaItem {type} {media} />
{/if}

{#if style === "list"}
  <Card>
    <ListMediaItem {media} />
  </Card>
{/if}
