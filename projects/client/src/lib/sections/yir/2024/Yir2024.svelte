<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import Yir2024PageInner from "./_internal/Yir2024PageInner.svelte";
  import Yir2024PlayCard from "./_internal/Yir2024PlayCard.svelte";
  import Yir2024StatsSection from "./_internal/Yir2024StatsSection.svelte";
  import Yir2024TopSection from "./_internal/Yir2024TopSection.svelte";

  const {
    detail,
    slug,
    year,
  }: {
    detail: YirDetail | null;
    slug: string;
    year: number;
  } = $props();
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="yir-2024">
  <!-- Top section paints immediately; the Hero core (year, name, label,
       membership) renders without the detail query, while the posters /
       watched-stats / first-play parts gate on `detail` being present. -->
  <Yir2024TopSection {detail} {slug} {year} />

  {#if detail}
    {#if detail.firstWatched}
      <Yir2024PageInner>
        <Yir2024PlayCard
          item={detail.firstWatched}
          headerLabel={m.yir_2024_first_play_of({ year })}
        />
      </Yir2024PageInner>
    {/if}

    {#if detail.stats.shows.playCounts.total > 0}
      <Yir2024PageInner>
        <Yir2024StatsSection type="shows" stats={detail.stats.shows} {year} />
      </Yir2024PageInner>
    {/if}

    {#if detail.stats.movies.playCounts.total > 0}
      <Yir2024PageInner>
        <Yir2024StatsSection type="movies" stats={detail.stats.movies} {year} />
      </Yir2024PageInner>
    {/if}

    <p class="yir-2024-pending">More sections coming soon&hellip;</p>

    {#if detail.lastWatched}
      <Yir2024PageInner>
        <Yir2024PlayCard
          item={detail.lastWatched}
          headerLabel={m.yir_2024_last_play_of({ year })}
        />
      </Yir2024PageInner>
    {/if}
  {:else}
    <!-- Detail query in flight: hero has already painted above; show a
         small inline indicator where the rest of the sections will mount. -->
    <div class="yir-2024-loading">
      <LoadingIndicator />
    </div>
  {/if}
</div>

<style lang="scss">
  // Parent-driven vertical rhythm via --content-gap so children don't carry
  // margins for inter-section spacing.
  .yir-2024 {
    --content-gap: var(--ni-72);

    display: flex;
    flex-direction: column;
    gap: var(--content-gap);
    background-color: var(--shade-950);
    color: var(--shade-10);
    // Scoped to the 2024 template so the Spline Sans face only swaps in
    // here and the rest of the app keeps the global Roboto stack.
    font-family: "Spline Sans", Helvetica, Arial, sans-serif;
  }

  .yir-2024-pending {
    margin: 0;
    padding: var(--ni-20);
    text-align: center;
    color: var(--shade-500);
  }

  .yir-2024-loading {
    display: flex;
    justify-content: center;
    padding: var(--ni-72) 0;
    color: var(--shade-300);
  }
</style>
