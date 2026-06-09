<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirCountriesGroup } from "$lib/requests/models/YirDetail.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName.ts";
  import YirCountriesMap from "../../_internal/YirCountriesMap.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import Yir2024StatSummary from "./Yir2024StatSummary.svelte";

  type Yir2024CountriesSectionProps = {
    type: "shows" | "movies";
    group: YirCountriesGroup;
  };

  const { type, group }: Yir2024CountriesSectionProps = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_2024_most_watched_show_countries()
      : m.yir_2024_most_watched_movie_countries(),
  );

  function countryName(code: string): string {
    return toCountryName(code, languageTag());
  }

  // FIXME(i18n): hardcoded English plurals match the existing convention
  // across the YIR module (see Yir2024CompaniesSection and the default
  // template). Migrate holistically when YIR i18n unit keys are added.
  function itemUnit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }

  // API returns the list sorted by count desc, so first = most, last = least.
  const countries = $derived(group.countries);

  const mostWatched = $derived(
    countries[0]
      ? { name: countryName(countries[0].code), count: countries[0].count }
      : undefined,
  );

  const leastWatched = $derived(
    countries.length > 1
      ? {
        name: countryName(countries[countries.length - 1].code),
        count: countries[countries.length - 1].count,
      }
      : undefined,
  );
</script>

<section class="yir-2024-countries" id="section-{type}-countries">
  <div class="yir-2024-countries-panel">
    <div class="yir-2024-countries-map">
      <YirCountriesMap {countries}>
        {#snippet tooltip({ country })}
          <YirTooltip
            main={countryName(country.code)}
            sub="{formatNumber(country.count)} {itemUnit(country.count)}"
          />
        {/snippet}
      </YirCountriesMap>
    </div>

    <div class="yir-2024-countries-caption">
      <h2 class="bold yir-2024-countries-heading">{heading}</h2>

      <Yir2024StatSummary
        {mostWatched}
        {leastWatched}
        countLabel={m.yir_2024_country_count()}
        total={group.countryCount}
        unit={itemUnit}
      />
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-countries {
    width: 100%;
  }

  // Transparent wrapper (no card) — the map is the hero, with the caption
  // stacked beneath it rather than overlaid.
  .yir-2024-countries-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--shade-10);
  }

  .yir-2024-countries-map {
    width: 100%;
    height: var(--ni-640);
    overflow: hidden;
    border-radius: var(--border-radius-xxl);

    @include for-tablet-sm-and-below {
      // Stacked: let the height follow the map's natural aspect so there's no
      // wasted vertical space above/below the world (2.26 ≈ the rendered
      // bounds of the world-50m geo asset).
      height: auto;
      aspect-ratio: 2.26;
    }

    @include for-mobile {
      border-radius: var(--border-radius-xl);
    }
  }

  // Heading + stat summary sit below the map. Narrow left column on wider
  // viewports (the two-line title keeps it compact); full width once stacked.
  .yir-2024-countries-caption {
    position: relative;
    width: min(var(--ni-480), 42%);
    // Pull the narrow caption up so the title tucks over the map's empty
    // bottom band; `position: relative` keeps it painting above the map.
    margin-top: var(--ni-neg-72);
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    @include for-tablet-sm-and-below {
      // Full-width caption sits below the map (no overlap) once stacked.
      width: 100%;
      margin-top: var(--ni-32);
    }

    @include for-mobile {
      margin-top: var(--ni-20);
      gap: var(--ni-20);
    }
  }

  .yir-2024-countries-heading {
    margin: 0;
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    line-height: 1.05;
    // Honor the message's newline (breaks after "Most Watched") on wider
    // viewports; collapse it to a natural wrap once the caption is full width.
    white-space: pre-line;

    @include for-tablet-sm-and-below {
      white-space: normal;
    }

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }
</style>
