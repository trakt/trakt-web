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
    max-width: var(--ni-1280);
    margin: 0 auto;

    @include for-tablet-sm-and-below {
      max-width: var(--ni-920);
    }

    @include for-mobile {
      max-width: 100%;
    }
  }
</style>
