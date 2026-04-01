<script lang="ts">
  import YirDefault from "./default/YirDefault.svelte";
  import YirTitleSection from "./default/_internal/YirTitleSection.svelte";
  import YirHeader from "./_internal/YirHeader.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useNavbarState } from "$lib/sections/navbar/useNavbarState";
  import { useYirDetail } from "./_internal/useYirDetail";

  const { slug, year }: { slug: string; year: number } = $props();

  const { detail, isLoading } = $derived(
    useYirDetail({ slug, year }),
  );

  // The expanded sidebar overlaps and crowds the YIR layout — force the
  // collapsed/default-width sidebar for the duration of this page.
  const { globalSet } = useNavbarState();
  $effect(() => {
    globalSet({ forceCollapsed: true });
    return () => globalSet({ forceCollapsed: false });
  });
</script>

<div class="yir-page" id="year-in-review">
  <YirHeader {slug} {year} />

  <YirTitleSection {slug} {year} coverImage={$detail?.images.cover} />

  {#if $isLoading}
    <div class="yir-loading">
      <LoadingIndicator />
    </div>
  {:else if $detail}
    <YirDefault detail={$detail} {slug} {year} />
  {/if}
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
    --color-text-primary-override: var(--shade-10);
    --color-text-secondary-override: var(--shade-500);

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

  .yir-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--ni-96) 0;
    color: var(--shade-10);
  }
</style>
