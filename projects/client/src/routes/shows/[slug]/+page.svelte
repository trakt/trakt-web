<script lang="ts">
  import { page } from "$app/stores";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { useShow } from "./useShow";
  const { show, intl, ratings, stats, progress, watchers, studios } = $derived(
    useShow($page.params.slug),
  );
</script>

<TraktPage
  title={$show?.title}
  info={$show}
  image={$show?.cover.url.thumb}
  type="show"
>
  {#if $show != null && $ratings != null && $stats != null && $intl != null && $studios != null}
    <ShowSummary
      media={$show}
      ratings={$ratings}
      watchers={$watchers}
      stats={$stats}
      intl={$intl}
      progress={$progress}
      studios={$studios}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
