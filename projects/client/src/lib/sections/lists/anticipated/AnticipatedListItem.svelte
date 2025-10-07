<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { AnticipatedEntry } from "./useAnticipatedList";

  const { type, media, style }: MediaCardProps<AnticipatedEntry> = $props();

  const isSummary = $derived(style === "summary");
</script>

{#snippet tag()}
  <AnticipatedTag
    i18n={TagIntlProvider}
    score={media.score}
    isTextOnly={isSummary}
  />
{/snippet}

<DefaultMediaItem
  {type}
  {media}
  {tag}
  {style}
  source="anticipated"
  canDeemphasize
/>
