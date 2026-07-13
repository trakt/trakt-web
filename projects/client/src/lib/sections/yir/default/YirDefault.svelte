<script lang="ts">
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import YirCalendarSection from "../_internal/YirCalendarSection.svelte";
  import YirGenresSection from "../_internal/YirGenresSection.svelte";
  import YirMostWatchedSection from "../_internal/YirMostWatchedSection.svelte";
  import YirNetworksSection from "../_internal/YirNetworksSection.svelte";
  import YirPeopleSection from "../_internal/YirPeopleSection.svelte";
  import YirRatedSection from "../_internal/YirRatedSection.svelte";
  import YirStatsSection from "../_internal/YirStatsSection.svelte";
  import YirStudiosSection from "../_internal/YirStudiosSection.svelte";
  import YirTitleSection from "../_internal/YirTitleSection.svelte";
  import YirTotalsSection from "../_internal/YirTotalsSection.svelte";
  import YirUpgradeSection from "../_internal/YirUpgradeSection.svelte";

  const {
    detail,
    isLoading,
    slug,
    year,
  }: {
    detail: YirDetail | null;
    isLoading: boolean;
    slug: string;
    year: number;
  } = $props();
</script>

<YirTitleSection {slug} {year} />

{#if detail}
  <YirTotalsSection stats={detail.stats.all} {year} />

  {#if detail.firstWatched}
    <YirCalendarSection how="first" item={detail.firstWatched} {year} />
  {/if}

  <!-- TV Shows -->
  {#if detail.stats.shows.playCounts.total > 0}
    <YirStatsSection type="shows" stats={detail.stats.shows} {year} />
  {/if}

  {#if detail.mostWatched.shows.length > 0}
    <YirMostWatchedSection type="shows" items={detail.mostWatched.shows} />
  {/if}

  {#if detail.genres.shows.itemCount > 0}
    <YirGenresSection type="shows" genres={detail.genres.shows} />
  {/if}

  {#if detail.networks.length > 0}
    <YirNetworksSection networks={detail.networks} />
  {/if}

  {#if detail.topRated.shows.length > 0}
    <YirRatedSection type="shows" items={detail.topRated.shows} />
  {/if}

  <!-- Movies -->
  {#if detail.stats.movies.playCounts.total > 0}
    <YirStatsSection type="movies" stats={detail.stats.movies} {year} />
  {/if}

  {#if detail.mostWatched.movies.length > 0}
    <YirMostWatchedSection type="movies" items={detail.mostWatched.movies} />
  {/if}

  {#if detail.genres.movies.itemCount > 0}
    <YirGenresSection type="movies" genres={detail.genres.movies} />
  {/if}

  {#if detail.studios.length > 0}
    <YirStudiosSection studios={detail.studios} />
  {/if}

  {#if detail.topRated.movies.length > 0}
    <YirRatedSection type="movies" items={detail.topRated.movies} />
  {/if}

  <!-- People -->
  <YirPeopleSection {slug} {year} />

  {#if detail.lastWatched}
    <YirCalendarSection how="last" item={detail.lastWatched} {year} />
  {/if}
{:else if isLoading}
  <YirTotalsSection stats={null} {year} />
{/if}

<YirUpgradeSection {slug} />
