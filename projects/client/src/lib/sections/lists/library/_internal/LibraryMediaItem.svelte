<script lang="ts">
  import DateTag from "$lib/components/media/tags/DateTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { LibraryItem } from "$lib/requests/queries/sync/libraryQuery";
  import MediaItem from "../../components/MediaItem.svelte";

  const {
    item,
    style = "cover",
  }: { item: LibraryItem; style?: "summary" | "cover" } = $props();

  const target = $derived.by(() => {
    if (item.type === "episode") {
      return {
        type: "show" as const,
        episode: item.episode,
        media: item.media,
      };
    }

    return {
      type: item.media.type,
      media: item.media,
    };
  });
</script>

{#snippet addedAtTag()}
  <div class="trakt-added-at-tag">
    <DateTag date={item.addedAt} i18n={TagIntlProvider} type="tag" />
  </div>
{/snippet}

<MediaItem
  {...target}
  source="library"
  variant="start"
  {style}
  coverTag={addedAtTag}
  tag={style === "summary" ? addedAtTag : undefined}
/>

<style>
  .trakt-added-at-tag {
    transform: scale(0.75);
    transform-origin: bottom left;
  }
</style>
