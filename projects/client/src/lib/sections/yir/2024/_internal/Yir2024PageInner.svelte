<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<div class="trakt-yir-2024-page-inner">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // Capped at the standard --ni-1280 (matches v2's --max-width: 1340px to
  // within ~60px) and centered with auto margins. Symmetric horizontal
  // padding clears the side navbar on the left (--layout-sidebar-distance,
  // set on .yir-page) and mirrors it on the right so the content sits
  // centered between the two safe-areas. Tablet-sm-and-below loses the side
  // navbar so the YIR-specific minimum bumps to var(--ni-40).
  .trakt-yir-2024-page-inner {
    width: 100%;
    max-width: var(--ni-1280);
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 max(var(--layout-distance-side), var(--layout-sidebar-distance));

    @include for-tablet-sm-and-below {
      padding: 0 var(--ni-40);
    }

    @include for-mobile {
      padding: 0 var(--ni-20);
    }
  }
</style>
