<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirCompany } from "$lib/requests/models/YirDetail.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import YirCompaniesBubbleChart from "../../_internal/YirCompaniesBubbleChart.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import Yir2024StatSummary from "./Yir2024StatSummary.svelte";

  type Yir2024CompaniesSectionProps = {
    type: "shows" | "movies";
    companies: YirCompany[];
  };

  const { type, companies }: Yir2024CompaniesSectionProps = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_2024_most_watched_networks()
      : m.yir_2024_most_watched_studios(),
  );

  const countLabel = $derived(
    type === "shows" ? m.yir_2024_network_count() : m.yir_2024_studio_count(),
  );

  const mostWatched = $derived(companies[0]);
  const leastWatched = $derived(
    companies.length > 1 ? companies[companies.length - 1] : undefined,
  );

  // FIXME(i18n): hardcoded English plurals match the existing convention
  // across the YIR module (default template uses the same pattern in
  // YirStatsSection, YirTotalsSection, YirMostWatchedSection, etc.).
  // Migrate holistically when i18n keys are added across all YIR sections.
  function itemUnit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<section class="trakt-yir-2024-companies-section" id="section-{type}-companies">
  <div class="yir-2024-companies-panel">
    <div class="yir-2024-companies-text">
      <h2 class="bold yir-2024-companies-heading">{heading}</h2>

      <Yir2024StatSummary
        {mostWatched}
        {leastWatched}
        {countLabel}
        total={companies.length}
        unit={itemUnit}
      />
    </div>

    <div class="yir-2024-companies-chart">
      <YirCompaniesBubbleChart {companies}>
        {#snippet tooltip({ company })}
          <YirTooltip
            main={company.name}
            sub="{formatNumber(company.count)} {itemUnit(company.count)}"
          />
        {/snippet}
      </YirCompaniesBubbleChart>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-companies-section {
    width: 100%;
  }

  // Transparent two-column layout: text on the left, bubble chart on the
  // right. Collapses to a single column on smaller viewports.
  .yir-2024-companies-panel {
    --panel-padding-x: var(--ni-44);
    --panel-padding-y: var(--ni-44);

    padding: var(--panel-padding-y) var(--panel-padding-x);
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: var(--ni-32);
    align-items: center;

    @include for-tablet-lg-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-24);
    }

    @include for-mobile {
      --panel-padding-x: var(--ni-20);
      --panel-padding-y: var(--ni-20);
    }
  }

  .yir-2024-companies-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    @include for-tablet-lg {
      flex-direction: row;
      align-items: center;

      .yir-2024-companies-heading {
        flex: 0 0 auto;
        width: min-content;
      }

      // Stat list is rendered by Yir2024StatSummary (its own scope), so it
      // has to be reached with :global to take the remaining row width.
      :global(.trakt-yir-2024-stat-summary) {
        flex: 1;
        min-width: 0;
      }
    }
  }

  .yir-2024-companies-heading {
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    color: var(--color-yir-text-primary);

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .yir-2024-companies-chart {
    width: 100%;
    min-width: 0;
    height: var(--ni-480);

    @include for-mobile {
      height: var(--ni-380);
    }
  }
</style>
