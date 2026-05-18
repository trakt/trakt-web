<script lang="ts">
  import YirHeader from "./_internal/YirHeader.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";
  import { getYirTemplate } from "./getYirTemplate";

  const { slug, year }: { slug: string; year: number } = $props();

  const { detail, isLoading } = $derived(useYirDetail({ slug, year }));
  const Template = $derived(getYirTemplate(year));
</script>

<div class="yir-page" id="year-in-review">
  <YirHeader {slug} {year} />
  <!-- Always mount the template so its scaffold (header text, hero shell)
       paints immediately; detail-dependent sections inside the template
       gate on `detail` and fill in once the query lands. -->
  <Template
    detail={$detail ?? null}
    isLoading={$isLoading}
    {slug}
    {year}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-page {
    display: flex;
    flex-direction: column;
    background-color: var(--shade-950);
    color: var(--shade-10);
    overflow-x: hidden;

    // YIR is rendered with a dark backdrop regardless of user theme.
    // These overrides force chart colors to stay legible.
    --color-bar-custom-default: var(--shade-300);
    --color-bar-custom-highlight: var(--shade-10);
    --color-bar-custom-hover: var(--red-700);
    --color-bar-chart-text-primary: var(--shade-10);
    --color-bar-chart-text-secondary: var(--shade-500);

    // YIR-only: account for the side navbar's outer margin (gap-s on each
    // side, see SideNavbar.svelte) so the visible gap on the right of the
    // navbar matches the gap on the left, instead of the global +ni-16.
    --layout-sidebar-distance: calc(
      var(--side-navbar-width) + 2 * var(--gap-s)
    );

    @include for-tablet-sm-and-below {
      --layout-sidebar-distance: 0;
    }
  }
</style>
