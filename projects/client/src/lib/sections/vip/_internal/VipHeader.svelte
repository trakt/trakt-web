<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    icon,
    description,
    children,
  }: { icon?: Snippet; description: Snippet } & ChildrenProps = $props();
</script>

<div class="trakt-vip-header-content">
  <div class="trakt-vip-header">
    {@render icon?.()}

    <h1 class="trakt-vip-header-title">
      {@render children()}
    </h1>
  </div>

  <div class="trakt-vip-description">
    {@render description()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    text-align: center;
  }

  .trakt-vip-header {
    display: flex;
    align-items: center;
    gap: var(--gap-l);

    :global(svg) {
      width: var(--ni-32);
      height: var(--ni-32);
    }
  }

  .trakt-vip-header-title {
    :global(.trakt-vip-badge) {
      display: inline-flex;
      vertical-align: middle;
      margin-left: var(--gap-xxs);
    }

    font-size: var(--ni-32);
    transition: font-size var(--transition-increment) ease-in-out;

    @include for-mobile {
      font-size: var(--font-size-title);
    }
  }

  .trakt-vip-description {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    @include for-mobile {
      max-width: 75dvw;
    }
  }
</style>
