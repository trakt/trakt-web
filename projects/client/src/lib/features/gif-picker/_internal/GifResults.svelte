<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import { gifSearchQuery } from "$lib/requests/queries/gifs/gifSearchQuery.ts";
  import { gifTrendingQuery } from "$lib/requests/queries/gifs/gifTrendingQuery.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { firstValueFrom, map } from "rxjs";
  import { untrack } from "svelte";
  import { GIF_PAGE_SIZE } from "./constants.ts";
  import type { GifResultsProps } from "./GifResultsProps.ts";
  import GifTile from "./GifTile.svelte";
  import { toGifColumns } from "./toGifColumns.ts";

  // The host keys on `query`, so the observer chain is built once at setup.
  const { customerId, query, onSelect }: GifResultsProps = $props();

  const results = useInfiniteQuery(
    untrack(() =>
      query
        ? gifSearchQuery({ query, customerId, limit: GIF_PAGE_SIZE })
        : gifTrendingQuery({ customerId, limit: GIF_PAGE_SIZE }),
    ),
  );

  const gifs = results.pipe(
    map((state) => state.data?.pages.flatMap((page) => page.entries) ?? []),
  );
  const isLoading = results.pipe(map((state) => state.isLoading));
  const hasNextPage = results.pipe(
    map((state) => Boolean(state.hasNextPage)),
  );

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const columnCount = $derived($isMobile ? 2 : $isDesktop ? 4 : 3);
  const columns = $derived(toGifColumns($gifs, columnCount));

  const loadMore = async () => {
    const state = await firstValueFrom(results);

    if (!state.hasNextPage || state.isFetchingNextPage) {
      return;
    }

    await state.fetchNextPage();
  };
</script>

<div class="trakt-gif-results">
  {#if $gifs.length > 0}
    <div class="gif-grid">
      {#each columns as column, index (index)}
        <div class="gif-column">
          {#each column as gif (gif.id)}
            <GifTile
              {gif}
              isReducedMotion={$isReducedMotion}
              onSelect={() => onSelect(gif)}
            />
          {/each}
        </div>
      {/each}
    </div>

    {#if $hasNextPage}
      <!--
        The observer stops watching once it fires, so the sentinel is rebuilt
        whenever a page lands - otherwise scrolling would only load one.
      -->
      {#key $gifs.length}
        <div class="gif-sentinel" use:whenInViewport={loadMore}></div>
      {/key}
    {/if}
  {:else if !$isLoading}
    <p class="secondary">{m.list_placeholder_empty()}</p>
  {/if}
</div>

<style lang="scss">
  .trakt-gif-results {
    display: flex;
    flex-direction: column;

    .gif-grid {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-xs);
    }

    .gif-column {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      flex: 1 1 0;
      min-width: 0;
    }

    .gif-sentinel {
      height: var(--ni-2);
    }
  }
</style>
