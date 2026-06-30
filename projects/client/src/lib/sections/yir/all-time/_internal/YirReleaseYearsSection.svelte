<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirReleaseYearsGroup } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { yirMediaUnit } from "../../_internal/yirMediaUnit.ts";
  import YirPageInner from "../../_internal/YirPageInner.svelte";
  import YirSectionHeader from "../../_internal/YirSectionHeader.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import YirYearBarChart from "../../_internal/YirYearBarChart.svelte";

  const {
    type,
    group,
  }: {
    type: "shows" | "movies";
    group: YirReleaseYearsGroup;
  } = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_section_title_show_release_years()
      : m.yir_section_title_movie_release_years(),
  );

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  // Mirror v2: collapse to decade buckets on mobile once the year span is wide
  // enough that per-year bars would be unreadable.
  const useDecades = $derived(
    $isMobile && group.years.length > 52 && group.decades.length > 0,
  );

  const chartData = $derived(
    useDecades
      ? group.decades.map((d) => ({ label: `${d.decade}s`, value: d.count }))
      : group.years.map((d) => ({ label: String(d.year), value: d.count })),
  );
</script>

<section
  class="trakt-yir-release-years-section"
  id="section-{type}-release-years"
>
  <YirPageInner>
    <YirSectionHeader>{heading}</YirSectionHeader>

    <div class="yir-chart-container">
      <YirYearBarChart data={chartData}>
        {#snippet tooltip({ value, label })}
          <YirTooltip
            main="{formatNumber(value)} {yirMediaUnit(type, value)}"
            sub={label}
          />
        {/snippet}
      </YirYearBarChart>
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-release-years-section {
    background-color: var(--color-yir-background);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-chart-container {
    overflow-x: auto;
    overflow-y: hidden;

    @include for-tablet-sm-and-below {
      padding-inline: var(--ni-20);
    }
  }
</style>
