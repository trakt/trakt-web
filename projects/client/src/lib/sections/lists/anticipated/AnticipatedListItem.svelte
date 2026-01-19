<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { AnticipatedEntry } from "./useAnticipatedList";

  const { type, media, style, mode }: MediaCardProps<AnticipatedEntry> =
    $props();
</script>

{#snippet tag()}
  {#if mode === "mixed"}
    <MediaIconTag mediaType={media.type} />
  {/if}

  <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
{/snippet}

<DefaultMediaItem
  {type}
  {media}
  {tag}
  {style}
  source="anticipated"
  canDeemphasize
/>
