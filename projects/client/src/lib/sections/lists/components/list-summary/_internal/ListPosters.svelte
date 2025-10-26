<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { getListUrl } from "./getListUrl.ts";

  const POSTER_LIMIT = 8;
  const { list, type }: { list: MediaListSummary; type?: DiscoverMode } =
    $props();

  const posters = $derived(list.posters.slice(0, POSTER_LIMIT));
</script>

{#if posters}
  <Link href={getListUrl(list, type)}>
    <div class="trakt-list-posters" style="--poster-count: {posters.length}">
      {#each posters as poster, index (`${list.id}_poster_${index}`)}
        <div class="poster-wrapper" style="--poster-index: {index}">
          <CrossOriginImage
            src={poster.url.thumb}
            alt={m.image_alt_list_preview_poster({ title: list.name })}
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

    box-shadow: var(--list-poster-shadow);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
