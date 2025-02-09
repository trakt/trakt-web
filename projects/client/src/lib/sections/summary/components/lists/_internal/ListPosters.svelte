<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useListItems } from "./useListItems.ts";

  const { list, type }: { list: MediaListSummary; type: MediaType } = $props();

  const { items } = useListItems({ id: list.id, type });
</script>

{#if $items}
  <div class="trakt-list-posters" style="--poster-count: {$items.length}">
    {#each $items as item, index}
      <div class="poster-wrapper" style="--poster-index: {index}">
        <CrossOriginImage
          animate={false}
          src={item.entry.poster.url.medium}
          alt={m.media_poster({ title: item.entry.title })}
        />
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-posters {
    --poster-width: var(--ni-120);
    --poster-height: var(--ni-180);

    height: var(--poster-height);
    width: 100%;

    display: flex;
    flex-shrink: 0;

    position: relative;

    counter-reset: number;
  }

  .poster-wrapper {
    --poster-index: 0;

    position: absolute;
    left: calc(
      (100% - var(--poster-width)) / (var(--poster-count) - 1) *
        var(--poster-index)
    );

    height: var(--poster-height);
    width: var(--poster-width);

    background-color: var(--color-card-background);
    box-shadow: -16px 0px 16px 0px rgba(0, 0, 0, 0.56);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
