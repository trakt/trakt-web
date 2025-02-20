<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { getListUrl } from "./getListUrl.ts";
  import { useListItems } from "./useListItems.ts";

  const { list, type }: { list: MediaListSummary; type?: MediaType } = $props();

  const { items } = useListItems({ list, type });
</script>

{#if $items}
  <Link href={getListUrl(list, type)}>
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
  </Link>
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

    --poster-overlap: var(--poster-width) / 5;
    --total-poster-width: calc(
      (var(--poster-width) - var(--poster-overlap)) * var(--poster-count)
    );

    --poster-spread-width: min(100%, var(--total-poster-width));
    --poster-offset: calc(
      (var(--poster-spread-width) - var(--poster-width)) /
        max(1, var(--poster-count) - 1)
    );

    position: absolute;
    left: calc(var(--poster-offset) * var(--poster-index));

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
