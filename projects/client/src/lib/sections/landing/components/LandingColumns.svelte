<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    left,
    children,
    right,
  }: { left: Snippet; right: Snippet } & ChildrenProps = $props();
</script>

<div class="trakt-landing-columns">
  <div class="trakt-landing-content-left">
    {@render left()}
  </div>

  <div class="trakt-landing-content-center">
    {@render children()}
  </div>

  <div class="trakt-landing-content-right">
    {@render right()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ni-380) minmax(0, 1fr);

    gap: var(--gap-xxl);

    transition: var(--transition-increment) ease-in-out;
    transition-property: gap, grid-template-columns;

    @include for-tablet-lg-and-below {
      grid-template-columns: minmax(0, 1fr) var(--ni-340) minmax(0, 1fr);
      gap: var(--gap-l);
    }
  }

  .trakt-landing-content-center {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xl);
  }

  .trakt-landing-content-left,
  .trakt-landing-content-right {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xxl);
  }

  .trakt-landing-content-left {
    align-items: flex-end;
  }
</style>
