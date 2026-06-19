<script lang="ts">
  import Yir2024 from "./2024/Yir2024.svelte";
  import MirHeader from "./_internal/MirHeader.svelte";
  import { useMirDetail } from "./_internal/useMirDetail";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    /** 1-12. */
    month: number;
  } = $props();

  const { detail, isLoading } = $derived(useMirDetail({ slug, year, month }));
</script>

<div class="trakt-mir-page" id="month-in-review">
  <MirHeader {slug} {year} {month} />
  <!-- Month in Review reuses the 2024 template in MIR mode: the same scaffold
       paints immediately and detail-dependent sections fill in once the query
       lands. -->
  <Yir2024
    detail={$detail ?? null}
    isLoading={$isLoading}
    {slug}
    {year}
    {month}
    mode="mir"
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mir-page {
    display: flex;
    flex-direction: column;
    background-color: var(--shade-950);
    color: var(--shade-10);
    overflow-x: hidden;

    // Breathing room below the final section so the last card doesn't sit
    // flush against the bottom of the page.
    padding-bottom: var(--ni-104);

    @include for-mobile {
      padding-bottom: var(--ni-72);
    }

    // MIR is rendered with a dark backdrop regardless of user theme.
    // These overrides force chart colors to stay legible.
    --color-bar-custom-default: var(--shade-300);
    --color-bar-custom-highlight: var(--shade-10);
    --color-bar-custom-hover: var(--red-700);
    --color-bar-chart-text-primary: var(--shade-10);
    --color-bar-chart-text-secondary: var(--shade-500);

    // Account for the side navbar's outer margin (gap-s on each side) so the
    // visible gap on the right of the navbar matches the gap on the left.
    --layout-sidebar-distance: calc(
      var(--side-navbar-width) + 2 * var(--gap-s)
    );

    @include for-tablet-sm-and-below {
      --layout-sidebar-distance: 0;
    }
  }
</style>
