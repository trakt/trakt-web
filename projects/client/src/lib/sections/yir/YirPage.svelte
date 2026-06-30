<script lang="ts">
  import type { YirYear } from "$lib/requests/models/YirYear";
  import YirAllTime from "./all-time/YirAllTime.svelte";
  import YirHeader from "./_internal/YirHeader.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";
  import { getYirTemplate } from "./getYirTemplate";

  const { slug, year }: { slug: string; year: YirYear } = $props();

  const { detail, isLoading } = $derived(useYirDetail({ slug, year }));
</script>

<div
  class="trakt-yir-page"
  class:is-2024-template={year === 2024}
  id="year-in-review"
>
  <YirHeader {slug} {year} />
  <!-- Always mount the template so its scaffold (header text, hero shell)
       paints immediately; detail-dependent sections inside the template
       gate on `detail` and fill in once the query lands. -->
  {#if year === "all"}
    <YirAllTime detail={$detail ?? null} isLoading={$isLoading} {slug} />
  {:else}
    {@const Template = getYirTemplate(year)}
    <Template
      detail={$detail ?? null}
      isLoading={$isLoading}
      {slug}
      {year}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-page {
    display: flex;
    flex-direction: column;
    background-color: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    overflow-x: hidden;

    // The fixed header floats over the hero. The default template's hero is a
    // dark poster in both themes, so the header text stays white there.
    --color-yir-header-foreground: var(--color-yir-poster-foreground);

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

  // The 2024 template's hero is theme-aware (not a dark poster), so the
  // header text must track the theme to stay legible over the light hero.
  .trakt-yir-page.is-2024-template {
    --color-yir-header-foreground: var(--color-yir-text-primary);
  }
</style>
