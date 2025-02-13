<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { AnticipatedEntry } from "./useAnticipatedList";

  const { type, media, style }: MediaCardProps<AnticipatedEntry> = $props();
</script>

{#snippet tags()}
  <!-- TODO: see if we don't want this all the time for anticipated, enable only
  for summary view ATM (mobile)-->
  {#if style === "summary"}
    <AirDateTag
      i18n={TagIntlProvider}
      year={media.year}
      airDate={media.airDate}
    />
  {/if}
  <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
{/snippet}

<MediaCard {type} {media} {tags} {style} />
