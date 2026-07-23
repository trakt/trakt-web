<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import ListSummaryCard from "$lib/sections/lists/components/ListSummaryCard.svelte";
  import { getSmartListFilterSummary } from "$lib/sections/lists/smart/getSmartListFilterSummary.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SmartListActions from "./SmartListActions.svelte";
  import { useSmartListPreview } from "./useSmartListPreview";

  const { list }: { list: SmartList } = $props();

  const href = $derived(UrlBuilder.lists.smart.view(list.slug));
  const { posters } = $derived(useSmartListPreview(list));
  const filterSummary = $derived(getSmartListFilterSummary(list));
</script>

<ListSummaryCard>
  <div class="trakt-smart-list-header">
    <div class="trakt-smart-list-icon" aria-hidden="true">
      {#if list.mediaType === "movies"}
        <MovieIcon />
      {:else}
        <ShowIcon />
      {/if}
    </div>

    <div class="trakt-smart-list-title">
      <Link {href}>
        <p class="secondary bold ellipsis">{list.title}</p>
      </Link>
      <p class="secondary small ellipsis">
        {filterSummary}
      </p>
    </div>

    <SmartListActions {list} />
  </div>

  <Link {href} color="inherit">
    <div
      class="trakt-smart-list-posters"
      style="--poster-count: {$posters.length}"
    >
      {#each $posters as poster, index (`${list.slug}_poster_${index}`)}
        <div class="poster-wrapper" style="--poster-index: {index}">
          <CrossOriginImage
            src={poster}
            alt={m.image_alt_list_preview_poster({ title: list.title })}
          />
        </div>
      {/each}
    </div>
  </Link>
</ListSummaryCard>

<style lang="scss">
  .trakt-smart-list-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-width: 0;
  }

  .trakt-smart-list-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-40);
    height: var(--ni-40);
    flex-shrink: 0;

    color: var(--color-text-secondary);
    background-color: color-mix(
      in srgb,
      var(--color-card-background) 78%,
      var(--color-foreground)
    );
    border-radius: var(--border-radius-s);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .trakt-smart-list-title {
    display: grid;
    min-width: 0;
    flex-grow: 1;

    :global(.trakt-link) {
      min-width: 0;
      text-decoration: none;
    }
  }

  .trakt-smart-list-posters {
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

    --poster-overlap: calc(var(--poster-width) / 5);
    --total-poster-width: calc(
      (var(--poster-width) - var(--poster-overlap)) * var(--poster-count)
    );
    --poster-spread-width: min(100%, var(--total-poster-width));
    --poster-offset: calc(
      (var(--poster-spread-width) - var(--poster-width)) /
        max(1, var(--poster-count) - 1)
    );

    position: absolute;
    inset-inline-start: calc(var(--poster-offset) * var(--poster-index));

    height: var(--poster-height);
    width: var(--poster-width);

    box-shadow: var(--shadow-floating);
    border-radius: var(--border-radius-m);
    overflow: hidden;

    :global(img) {
      width: 100%;
      height: 100%;
    }
  }
</style>
