<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    icon,
    description,
    children,
    variant = "default",
  }: {
    icon?: Snippet;
    description: Snippet;
    variant?: "default" | "hero";
  } & ChildrenProps = $props();
</script>

<div class="trakt-vip-header-content" data-variant={variant}>
  {@render icon?.()}

  <h1 class="trakt-vip-header-title">
    {@render children()}
  </h1>

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

    :global(svg) {
      width: var(--ni-48);
      height: var(--ni-48);
    }
  }

  .trakt-vip-header-title {
    :global(.trakt-vip-badge) {
      display: inline-flex;
      vertical-align: middle;
      margin-left: var(--gap-xxs);
    }

    font-size: var(--ni-40);
    font-weight: normal;
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

    :global(.trakt-vip-badge) {
      display: inline-flex;
      vertical-align: middle;
    }

    @include for-mobile {
      max-width: 75dvw;
    }
  }

  .trakt-vip-header-content[data-variant="hero"] {
    .trakt-vip-header-title {
      font-size: var(--ni-66);

      @include for-mobile {
        font-size: var(--ni-32);
      }
    }

    .trakt-vip-description {
      gap: var(--gap-xxs);

      :global(.secondary) {
        color: var(--color-text-primary);
        font-size: var(--ni-16);
      }
    }
  }
</style>
