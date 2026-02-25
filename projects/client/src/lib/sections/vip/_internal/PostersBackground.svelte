<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useTrendingItems } from "../../landing/useTrendingItems";

  const { type }: { type: MediaType } = $props();

  const { list } = $derived(useTrendingItems(type));

  function isOddColumn(index: number): boolean {
    return index % 2 === 1;
  }
</script>

<div class="trakt-background-posters">
  {#each $list as media, index (media.key)}
    <div class="trakt-media-wrapper" class:has-offset={!isOddColumn(index)}>
      <CardCover
        title={media.title}
        src={media.poster.url.thumb}
        alt={m.image_alt_media_poster({ title: media.title })}
      />
    </div>
  {/each}
</div>

<style>
  .trakt-background-posters {
    --area-offset: var(--ni-24);

    position: absolute;
    inset: calc(-1 * var(--area-offset));

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--gap-s);
    justify-content: center;

    z-index: var(--layer-background);

    opacity: 0.1;

    :global(.trakt-card-cover-image) {
      width: var(--ni-88);
      height: var(--ni-132);
    }

    .trakt-media-wrapper.has-offset {
      transform: translateY(var(--ni-18));
    }
  }
</style>
