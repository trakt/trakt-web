<script lang="ts">
  import { page } from "$app/stores";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { useShow } from "./useShow";
  const { show, intl, ratings, progress, reload } = $derived(
    useShow($page.params.slug),
  );
</script>

<TraktPage title={$show?.title}>
  {#if $show != null && $ratings != null && $intl != null}
    <ShowSummary
      media={$show}
      ratings={$ratings}
      intl={$intl}
      progress={$progress}
      onMarkAsWatched={reload}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 616px; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
