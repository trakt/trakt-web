<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirCompany } from "$lib/requests/models/YirDetail.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import YirCompaniesBubbleChart from "../../_internal/YirCompaniesBubbleChart.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

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
  const leastWatched = $derived(companies[companies.length - 1]);
  const companyCount = $derived(companies.length);

  // FIXME(i18n): hardcoded English plurals match the existing convention
  // across the YIR module (default template uses the same pattern in
  // YirStatsSection, YirTotalsSection, YirMostWatchedSection, etc.).
  // Migrate holistically when i18n keys are added across all YIR sections.
  function itemUnit(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
  }
</script>

<section class="yir-2024-companies" id="section-{type}-companies">
  <div class="yir-2024-companies-panel">
    <div class="yir-2024-companies-text">
      <h2 class="bold yir-2024-companies-heading">{heading}</h2>

      <dl class="yir-2024-companies-stats">
        {#if mostWatched}
          <div class="yir-2024-companies-row">
            <dt>{m.yir_2024_companies_most_watched()}</dt>
            <dd>
              <span class="ellipsis yir-2024-companies-name">
                {mostWatched.name}
              </span>
              <span class="bold uppercase tag yir-2024-companies-count">
                {formatNumber(mostWatched.count)}
                {itemUnit(mostWatched.count)}
              </span>
            </dd>
          </div>
        {/if}

        {#if leastWatched && leastWatched.id !== mostWatched?.id}
          <div class="yir-2024-companies-row">
            <dt>{m.yir_2024_companies_least_watched()}</dt>
            <dd>
              <span class="ellipsis yir-2024-companies-name">
                {leastWatched.name}
              </span>
              <span class="bold uppercase tag yir-2024-companies-count">
                {formatNumber(leastWatched.count)}
                {itemUnit(leastWatched.count)}
              </span>
            </dd>
          </div>
        {/if}

        <div class="yir-2024-companies-row">
          <dt>{countLabel}</dt>
          <dd class="yir-2024-companies-total">{formatNumber(companyCount)}</dd>
        </div>
      </dl>
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

  .yir-2024-companies {
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

      .yir-2024-companies-stats {
        flex: 1;
        min-width: 0;
      }
    }
  }

  .yir-2024-companies-heading {
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    color: var(--shade-10);

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .yir-2024-companies-stats {
    display: flex;
    flex-direction: column;
  }

  // Each row has a light divider under it (matching v2's stat-line) so the
  // three rows read as a list. Last row drops the divider.
  .yir-2024-companies-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ni-32);
    padding: var(--ni-16) 0;
    border-bottom: var(--border-thickness-xxs) solid var(--shade-800);

    &:last-child {
      border-bottom: none;
    }

    @include for-tablet-sm-and-below {
      gap: var(--ni-16);
    }

    dt {
      font-size: var(--font-size-title);
      color: var(--shade-10);
    }

    dd {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      font-size: var(--font-size-title);
      color: var(--shade-10);
      min-width: 0;
    }
  }

  // Network/studio name pops in the YIR purple so it visually links back to
  // the bubble chart's highlight color (also matches v2's link styling).
  // Truncation handled by the `.ellipsis` utility class on the markup.
  .yir-2024-companies-name {
    color: var(--purple-300);
  }

  // Pill-shaped count badge with white background + dark text — matches
  // the v2 design exactly. `--border-radius-xxl` is the established YIR /
  // v3 token for pill-shaped tags (used by VIP badges, MostPopularTag, etc).
  // Font sizing is handled by the `.tag` utility class on the markup.
  .yir-2024-companies-count {
    background: var(--shade-10);
    color: var(--shade-900);
    border-radius: var(--border-radius-xxl);
    padding: var(--ni-4) var(--ni-10);
    white-space: nowrap;
  }

  .yir-2024-companies-total {
    color: var(--shade-10);
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
