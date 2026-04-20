<script lang="ts">
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import YirTitleSection from "./_internal/YirTitleSection.svelte";
  import YirTotalsSection from "./_internal/YirTotalsSection.svelte";
  import YirCalendarSection from "./_internal/YirCalendarSection.svelte";
  import YirStatsSection from "./_internal/YirStatsSection.svelte";
  import YirMostWatchedSection from "./_internal/YirMostWatchedSection.svelte";
  import YirGenresSection from "./_internal/YirGenresSection.svelte";
  import YirNetworksSection from "./_internal/YirNetworksSection.svelte";
  import YirStudiosSection from "./_internal/YirStudiosSection.svelte";
  import YirRatedSection from "./_internal/YirRatedSection.svelte";
  import YirPeopleSection from "./_internal/YirPeopleSection.svelte";
  import YirUpgradeSection from "./_internal/YirUpgradeSection.svelte";

  const {
    detail,
    slug,
    year,
  }: {
    detail: YirDetail;
    slug: string;
    year: number;
  } = $props();
</script>

<div class="yir-default" id="year-in-review">
  <YirTitleSection {slug} {year} coverImage={detail.images.cover} />

  <YirTotalsSection stats={detail.stats.all} {year} />

  {#if detail.firstWatched}
    <YirCalendarSection
      how="first"
      item={detail.firstWatched}
      {year}
    />
  {/if}

  <!-- TV Shows -->
  {#if detail.stats.shows.playCounts.total > 0}
    <YirStatsSection
      type="shows"
      stats={detail.stats.shows}
      {year}
    />
  {/if}

  {#if detail.mostWatched.shows.length > 0}
    <YirMostWatchedSection
      type="shows"
      items={detail.mostWatched.shows}
    />
  {/if}

  {#if detail.genres.shows.itemCount > 0}
    <YirGenresSection
      type="shows"
      genres={detail.genres.shows}
    />
  {/if}

  {#if detail.networks.length > 0}
    <YirNetworksSection networks={detail.networks} />
  {/if}

  {#if detail.topRated.shows.length > 0}
    <YirRatedSection
      type="shows"
      items={detail.topRated.shows}
    />
  {/if}

  <!-- Movies -->
  {#if detail.stats.movies.playCounts.total > 0}
    <YirStatsSection
      type="movies"
      stats={detail.stats.movies}
      {year}
    />
  {/if}

  {#if detail.mostWatched.movies.length > 0}
    <YirMostWatchedSection
      type="movies"
      items={detail.mostWatched.movies}
    />
  {/if}

  {#if detail.genres.movies.itemCount > 0}
    <YirGenresSection
      type="movies"
      genres={detail.genres.movies}
    />
  {/if}

  {#if detail.productionCompanies.length > 0}
    <YirStudiosSection studios={detail.productionCompanies} />
  {/if}

  {#if detail.topRated.movies.length > 0}
    <YirRatedSection
      type="movies"
      items={detail.topRated.movies}
    />
  {/if}

  <!-- People -->
  <YirPeopleSection {slug} {year} />

  {#if detail.lastWatched}
    <YirCalendarSection
      how="last"
      item={detail.lastWatched}
      {year}
    />
  {/if}

  <YirUpgradeSection />
</div>

<style lang="scss">
  .yir-default {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--shade-950);
    color: var(--shade-10);
    overflow-x: hidden;
  }
</style>
