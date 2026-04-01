<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<div class="yir-page-inner">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-page-inner {
    position: relative;
    width: 100%;
    max-width: var(--ni-1280);
    margin: 0 auto;
    // On desktop, --layout-sidebar-distance accounts for the fixed side
    // navbar (width + gap); on tablet-sm-and-below it's 0 since there's no
    // side nav. Keeping it symmetric so the page reads centered.
    padding: 0
      max(var(--layout-distance-side), var(--layout-sidebar-distance));
    box-sizing: border-box;

    @include for-tablet-sm-and-below {
      max-width: var(--ni-920);
    }
  }
</style>
