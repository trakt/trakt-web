<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import YirCalendarSection from "../_internal/YirCalendarSection.svelte";
  import YirGenresSection from "../_internal/YirGenresSection.svelte";
  import YirNetworksSection from "../_internal/YirNetworksSection.svelte";
  import YirPeopleSection from "../_internal/YirPeopleSection.svelte";
  import YirRatedSection from "../_internal/YirRatedSection.svelte";
  import YirStatsSection from "../_internal/YirStatsSection.svelte";
  import YirStudiosSection from "../_internal/YirStudiosSection.svelte";
  import YirTitleSection from "../_internal/YirTitleSection.svelte";
  import YirTotalsSection from "../_internal/YirTotalsSection.svelte";
  import YirUpgradeSection from "../_internal/YirUpgradeSection.svelte";
  import YirCountriesSection from "./_internal/YirCountriesSection.svelte";
  import YirListProgressSection from "./_internal/YirListProgressSection.svelte";
  import YirReleaseYearsSection from "./_internal/YirReleaseYearsSection.svelte";
  import YirTopSection from "./_internal/YirTopSection.svelte";

  const {
    detail,
    slug,
  }: {
    detail: YirDetail | null;
    /**
     * Accepted for prop-type parity with the year-based templates; the all-time
     * template progressively fills in as `detail` lands and doesn't render an
     * inline loading indicator.
     */
    isLoading: boolean;
    slug: string;
  } = $props();

  // The plays-by-week tooltip (default template) needs a concrete year for its
  // date-range labels; the all-time view aggregates across years, so pass the
  // current year. (Week distributions aren't shown all-time anyway.)
  const chartYear = new Date().getFullYear();

  // Title subtitle shows the user's watch span, e.g. "2009 → 2026 Stats".
  const firstYear = $derived(detail?.firstWatched?.watchedAt.getFullYear());
  const lastYear = $derived(detail?.lastWatched?.watchedAt.getFullYear());
  const titleSubtitle = $derived(
    firstYear && lastYear
      ? m.yir_subtitle_all_time_range({ start: firstYear, end: lastYear })
      : undefined,
  );

  function hasGlobalTop(items: YirDetail["globalTop"]): items is NonNullable<
    YirDetail["globalTop"]
  > {
    return items != null;
  }
</script>

<!-- Title paints immediately; detail-gated sections fill in once loaded. -->
<YirTitleSection
  {slug}
  year="all"
  coverImage={detail?.images.cover}
  subtitleOverride={titleSubtitle}
/>

{#if detail}
  <YirTotalsSection stats={detail.stats.all} year="all" />

  {#if detail.firstWatched}
    <YirCalendarSection how="first" item={detail.firstWatched} year="all" />
  {/if}

  <!-- TV Shows -->
  {#if detail.stats.shows.playCounts.total > 0}
    <YirStatsSection
      type="shows"
      stats={detail.stats.shows}
      year={chartYear}
      yearlyPlays={detail.stats.shows.distributions?.yearly ?? undefined}
    />
  {/if}

  {#if detail.mostWatched.shows.length > 0 || (hasGlobalTop(detail.globalTop) && detail.globalTop.shows.length > 0)}
    <YirTopSection
      type="shows"
      {firstYear}
      {lastYear}
      userItems={detail.mostWatched.shows}
      globalItems={detail.globalTop?.shows ?? []}
    />
  {/if}

  {#if detail.genres.shows.itemCount > 0}
    <YirGenresSection type="shows" genres={detail.genres.shows} />
  {/if}

  {#if detail.releaseYears && detail.releaseYears.shows.years.length > 0}
    <YirReleaseYearsSection type="shows" group={detail.releaseYears.shows} />
  {/if}

  {#if detail.countries.shows.countries.length > 0}
    <YirCountriesSection type="shows" group={detail.countries.shows} />
  {/if}

  {#if detail.networks.length > 0}
    <YirNetworksSection networks={detail.networks} />
  {/if}

  {#if detail.listProgress && detail.listProgress.shows.length > 0}
    <YirListProgressSection lists={detail.listProgress.shows} />
  {/if}

  {#if detail.topRated.shows.length > 0}
    <YirRatedSection
      type="shows"
      items={detail.topRated.shows}
      ratingsDistribution={detail.stats.shows.ratingsDistribution ?? undefined}
    />
  {/if}

  <!-- Movies -->
  {#if detail.stats.movies.playCounts.total > 0}
    <YirStatsSection
      type="movies"
      stats={detail.stats.movies}
      year={chartYear}
      yearlyPlays={detail.stats.movies.distributions?.yearly ?? undefined}
    />
  {/if}

  {#if detail.mostWatched.movies.length > 0 || (hasGlobalTop(detail.globalTop) && detail.globalTop.movies.length > 0)}
    <YirTopSection
      type="movies"
      {firstYear}
      {lastYear}
      userItems={detail.mostWatched.movies}
      globalItems={detail.globalTop?.movies ?? []}
    />
  {/if}

  {#if detail.genres.movies.itemCount > 0}
    <YirGenresSection type="movies" genres={detail.genres.movies} />
  {/if}

  {#if detail.releaseYears && detail.releaseYears.movies.years.length > 0}
    <YirReleaseYearsSection type="movies" group={detail.releaseYears.movies} />
  {/if}

  {#if detail.countries.movies.countries.length > 0}
    <YirCountriesSection type="movies" group={detail.countries.movies} />
  {/if}

  {#if detail.studios.length > 0}
    <YirStudiosSection studios={detail.studios} />
  {/if}

  {#if detail.listProgress && detail.listProgress.movies.length > 0}
    <YirListProgressSection lists={detail.listProgress.movies} />
  {/if}

  {#if detail.topRated.movies.length > 0}
    <YirRatedSection
      type="movies"
      items={detail.topRated.movies}
      ratingsDistribution={detail.stats.movies.ratingsDistribution ?? undefined}
    />
  {/if}

  <!-- People -->
  <YirPeopleSection {slug} year="all" />

  {#if detail.lastWatched}
    <YirCalendarSection how="last" item={detail.lastWatched} year="all" />
  {/if}

  <YirUpgradeSection />
{/if}
