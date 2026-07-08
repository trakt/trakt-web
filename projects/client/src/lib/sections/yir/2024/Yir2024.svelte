<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import type { ReviewMode } from "../ReviewMode";
  import YirLoading from "../_internal/YirLoading.svelte";
  import Yir2024CompaniesSection from "./_internal/Yir2024CompaniesSection.svelte";
  import Yir2024CountriesSection from "./_internal/Yir2024CountriesSection.svelte";
  import Yir2024GenresSection from "./_internal/Yir2024GenresSection.svelte";
  import Yir2024MostPlayedSection from "./_internal/Yir2024MostPlayedSection.svelte";
  import Yir2024PageInner from "./_internal/Yir2024PageInner.svelte";
  import Yir2024PeopleSection from "./_internal/Yir2024PeopleSection.svelte";
  import Yir2024PlayCard from "./_internal/Yir2024PlayCard.svelte";
  import Yir2024RatedSection from "./_internal/Yir2024RatedSection.svelte";
  import Yir2024StatsMonthlySection from "./_internal/Yir2024StatsMonthlySection.svelte";
  import Yir2024StatsSection from "./_internal/Yir2024StatsSection.svelte";
  import Yir2024StreamingSection from "./_internal/Yir2024StreamingSection.svelte";
  import Yir2024ThanksSection from "./_internal/Yir2024ThanksSection.svelte";
  import Yir2024TopSection from "./_internal/Yir2024TopSection.svelte";
  import Yir2024TrendsSection from "./_internal/Yir2024TrendsSection.svelte";

  const {
    detail,
    isLoading,
    slug,
    year,
    month = 1,
    mode = "yir",
  }: {
    detail: YirDetail | null;
    isLoading: boolean;
    slug: string;
    year: number;
    /** 1-12. Only meaningful in MIR mode; ignored for YIR. */
    month?: number;
    mode?: ReviewMode;
  } = $props();

  // Year in Review surfaces the full top-10; Month in Review trims to a
  // compact top-3 (matches v2's monthly_mode limit).
  const isMir = $derived(mode === "mir");
  const isYir = $derived(!isMir);
  const mostPlayedLimit = $derived(isMir ? 3 : 10);
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
  <Yir2024TopSection {detail} {slug} {year} {month} {mode} />

  {#if detail}
    {#if detail.firstWatched}
      <Yir2024PageInner>
        <Yir2024PlayCard
          item={detail.firstWatched}
          playLabel={m.yir_2024_first_play()}
          {year}
        />
      </Yir2024PageInner>
    {/if}

    <!-- MIR-only: streaming availability, rendered right after the first play
         (mirrors v2's monthly_mode placement). -->
    {#if isMir && (detail.streamingServices?.services.length ?? 0) > 0}
      <Yir2024PageInner>
        <Yir2024StreamingSection
          services={detail.streamingServices?.services ?? []}
          country={detail.streamingServices?.country ?? ""}
        />
      </Yir2024PageInner>
    {/if}

    {#if detail.stats.shows.playCounts.total > 0}
      <Yir2024PageInner>
        {#if isMir}
          <Yir2024StatsMonthlySection
            type="shows"
            stats={detail.stats.shows}
            {month}
            {year}
          />
        {:else}
          <Yir2024StatsSection type="shows" stats={detail.stats.shows} {year} />
        {/if}
      </Yir2024PageInner>
    {/if}

    {#if detail.mostWatched.shows.length > 0}
      <Yir2024PageInner>
        <Yir2024MostPlayedSection
          type="shows"
          items={detail.mostWatched.shows.slice(0, mostPlayedLimit)}
        />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.networks.length > 0}
      <Yir2024PageInner>
        <Yir2024CompaniesSection type="shows" companies={detail.networks} />
      </Yir2024PageInner>
    {/if}

    {#if detail.genres.shows.itemCount > 0}
      <Yir2024PageInner>
        <Yir2024GenresSection type="shows" genres={detail.genres.shows} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.topRated.shows.length > 0}
      <Yir2024PageInner>
        <Yir2024RatedSection type="shows" items={detail.topRated.shows} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.countries.shows.countryCount > 0}
      <Yir2024PageInner>
        <Yir2024CountriesSection type="shows" group={detail.countries.shows} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && (detail.trends?.shows.length ?? 0) > 0}
      <Yir2024PageInner>
        <Yir2024TrendsSection
          type="shows"
          items={detail.trends?.shows ?? []}
          {year}
        />
      </Yir2024PageInner>
    {/if}

    {#if detail.stats.movies.playCounts.total > 0}
      <Yir2024PageInner>
        {#if isMir}
          <Yir2024StatsMonthlySection
            type="movies"
            stats={detail.stats.movies}
            {month}
            {year}
          />
        {:else}
          <Yir2024StatsSection
            type="movies"
            stats={detail.stats.movies}
            {year}
          />
        {/if}
      </Yir2024PageInner>
    {/if}

    {#if detail.mostWatched.movies.length > 0}
      <Yir2024PageInner>
        <Yir2024MostPlayedSection
          type="movies"
          items={detail.mostWatched.movies.slice(0, mostPlayedLimit)}
        />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.studios.length > 0}
      <Yir2024PageInner>
        <Yir2024CompaniesSection type="movies" companies={detail.studios} />
      </Yir2024PageInner>
    {/if}

    {#if detail.genres.movies.itemCount > 0}
      <Yir2024PageInner>
        <Yir2024GenresSection type="movies" genres={detail.genres.movies} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.topRated.movies.length > 0}
      <Yir2024PageInner>
        <Yir2024RatedSection type="movies" items={detail.topRated.movies} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && detail.countries.movies.countryCount > 0}
      <Yir2024PageInner>
        <Yir2024CountriesSection type="movies" group={detail.countries.movies} />
      </Yir2024PageInner>
    {/if}

    {#if isYir && (detail.trends?.movies.length ?? 0) > 0}
      <Yir2024PageInner>
        <Yir2024TrendsSection
          type="movies"
          items={detail.trends?.movies ?? []}
          {year}
        />
      </Yir2024PageInner>
    {/if}

    {#if isYir}
      <Yir2024PageInner>
        <Yir2024PeopleSection {slug} {year} />
      </Yir2024PageInner>
    {/if}

    {#if detail.lastWatched}
      <Yir2024PageInner>
        <Yir2024PlayCard
          item={detail.lastWatched}
          playLabel={m.yir_2024_last_play()}
          {year}
        />
      </Yir2024PageInner>
    {/if}

    {#if isYir && ((detail.thanks?.shows.length ?? 0) > 0 || (detail.thanks
      ?.movies.length ?? 0) > 0)}
      <Yir2024PageInner>
        <Yir2024ThanksSection
          shows={detail.thanks?.shows ?? []}
          movies={detail.thanks?.movies ?? []}
          {year}
        />
      </Yir2024PageInner>
    {/if}
  {:else if isLoading}
    <!-- Detail query in flight: hero has already painted above; show a
         small inline indicator where the rest of the sections will mount. -->
    <YirLoading />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // Parent-driven vertical rhythm via --content-gap so children don't carry
  // margins for inter-section spacing.
  .yir-2024 {
    --content-gap: var(--ni-72);

    display: flex;
    flex-direction: column;
    gap: var(--content-gap);
    background-color: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    // Scoped to the 2024 template so the Spline Sans face only swaps in
    // here and the rest of the app keeps the global Roboto stack.
    font-family: "Spline Sans", Helvetica, Arial, sans-serif;

    // Tighter section rhythm on phones.
    @include for-mobile {
      --content-gap: var(--ni-40);
    }
  }

</style>
