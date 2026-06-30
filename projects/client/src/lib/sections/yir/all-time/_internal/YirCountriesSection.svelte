<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirCountriesGroup } from "$lib/requests/models/YirDetail";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName";
  import YirCountriesMap from "../../_internal/YirCountriesMap.svelte";
  import YirPageInner from "../../_internal/YirPageInner.svelte";
  import YirSectionHeader from "../../_internal/YirSectionHeader.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const {
    type,
    group,
  }: {
    type: "shows" | "movies";
    group: YirCountriesGroup;
  } = $props();

  // The geo asset's natural bounds are ~2.26 (width ÷ height).
  const MAP_ASPECT = 2.26;

  // Carbon's choropleth measures both width and height off the DOM. Measuring a
  // CSS `aspect-ratio` height is unreliable mid-layout — the first (TV) map
  // routinely measured too tall and got clipped. Instead derive an explicit
  // pixel height from the measured width (always stable), giving the choropleth
  // a definite box that keeps the exact 2.26 fit at any width.
  const { observedDimension: mapWidth, observeDimension: observeMapWidth } =
    useDimensionObserver("width");
  const mapHeight = $derived(
    $mapWidth > 0 ? Math.round($mapWidth / MAP_ASPECT) : 0,
  );

  // Lazy-render the heavy Carbon map only once the section scrolls into view.
  let isMapVisible = $state(false);

  const heading = $derived(
    type === "shows"
      ? m.yir_section_title_show_countries()
      : m.yir_section_title_movie_countries(),
  );

  function countryName(code: string): string {
    return toCountryName(code, languageTag());
  }

  // FIXME(i18n): hardcoded English plurals match the existing YIR convention.
  function unit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<section class="trakt-yir-countries-section" id="section-{type}-countries">
  <YirPageInner>
    <YirSectionHeader>{heading}</YirSectionHeader>

    <div
      class="yir-countries-map"
      use:observeMapWidth
      use:whenInViewport={() => (isMapVisible = true)}
      style:height={mapHeight > 0 ? `${mapHeight}px` : null}
    >
      {#if isMapVisible}
        <YirCountriesMap countries={group.countries}>
          {#snippet tooltip({ country })}
            <YirTooltip
              main={countryName(country.code)}
              sub="{formatNumber(country.count)} {unit(country.count)}"
            />
          {/snippet}
        </YirCountriesMap>
      {/if}
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-countries-section {
    background-color: var(--color-yir-background);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-countries-map {
    width: 100%;
    // Pre-measurement fallback; the inline pixel height (width ÷ 2.26, set from
    // the measured width) takes over once JS runs and gives the choropleth a
    // definite box to resolve its height against.
    aspect-ratio: 2.26;
    overflow: hidden;
    border-radius: var(--border-radius-xxl);

    @include for-mobile {
      border-radius: var(--border-radius-xl);
    }
  }
</style>
