<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { of } from "rxjs";
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

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  // The only case that reliably fails is your own page while non-VIP,
  // so skip the query there and show the identity + upsell.
  // Other profiles may be viewable, so let the query decide.
  const { detail, isLoading } = $derived(
    !$isMe || $user?.isVip
      ? useMirDetail({ slug, year, month })
      : { detail: of(null), isLoading: of(false) },
  );
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

    min-height: 100dvh;
    background-color: var(--color-yir-background);
    color: var(--color-yir-text-primary);
    overflow-x: hidden;

    // MIR renders the theme-aware 2024 template, so the fixed header's text
    // tracks the theme to stay legible over the light hero.
    --color-yir-header-foreground: var(--color-yir-text-primary);

    // Breathing room below the final section so the last card doesn't sit
    // flush against the bottom of the page.
    padding-bottom: var(--ni-104);

    @include for-mobile {
      padding-bottom: var(--ni-72);
    }

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
