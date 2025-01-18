<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import ListMediaItem from "$lib/sections/navbar/components/search/ListMediaItem.svelte";
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { AnticipatedMediaItem } from "./useAnticipatedList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<AnticipatedMediaItem> & MediaStyleProps = $props();
</script>

{#snippet tags()}
  <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
{/snippet}

{#if style === "card"}
  <MediaItem {type} {media} {tags} />
{/if}

{#if style === "list"}
  <Card>
    <ListMediaItem {media} {tags} />
  </Card>
{/if}
