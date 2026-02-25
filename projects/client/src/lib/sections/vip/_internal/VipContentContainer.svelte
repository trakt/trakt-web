<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, header }: { header?: Snippet } & ChildrenProps = $props();
</script>

<div class="trakt-vip-content-container">
  {@render header?.()}

  <div class="trakt-vip-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-content-container,
  .trakt-vip-content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .trakt-vip-content-container {
    gap: var(--gap-xl);

    transition: gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      gap: var(--gap-l);
    }
  }
</style>
