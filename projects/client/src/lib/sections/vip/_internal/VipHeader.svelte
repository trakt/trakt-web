<script lang="ts">
  import ThreadRing from "$lib/components/badge/ThreadRing.svelte";
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
  {#if icon && variant === "hero"}
    <div class="trakt-vip-hero-stage">
      <span class="hero-aura"></span>
      <span class="hero-orbit"><ThreadRing /></span>
      <span class="hero-icon">{@render icon()}</span>
    </div>
  {:else}
    {@render icon?.()}
  {/if}

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

    // Size only the hero icon snippet (rendered as a direct child); a blanket
    // svg selector would also hit the sparkle inside nested VIP badges.
    > :global(svg) {
      width: var(--ni-48);
      height: var(--ni-48);
    }
  }

  .trakt-vip-header-title {
    :global(.trakt-vip-badge) {
      display: inline-flex;
      vertical-align: middle;
      margin-inline-start: var(--gap-xxs);
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

    .trakt-vip-header-title,
    .trakt-vip-description {
      position: relative;
    }

    .trakt-vip-header-title,
    .trakt-vip-description > :global(*) {
      animation: vip-hero-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
    }

    .trakt-vip-header-title {
      animation-delay: 240ms;
    }

    .trakt-vip-description > :global(:nth-child(1)) {
      animation-delay: 360ms;
    }

    .trakt-vip-description > :global(:nth-child(2)) {
      animation-delay: 480ms;
    }
  }

  .trakt-vip-hero-stage {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-72);
    height: var(--ni-72);

    .hero-aura {
      position: absolute;
      width: var(--ni-220);
      height: var(--ni-220);

      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--purple-500) 50%, transparent) 0%,
        color-mix(in srgb, var(--purple-500) 16%, transparent) 40%,
        transparent 70%
      );

      pointer-events: none;

      animation: vip-hero-breath 4s ease-in-out infinite;
    }

    .hero-orbit {
      position: absolute;
      inset: 0;
      border-radius: 50%;

      animation: vip-hero-pop 600ms var(--transition-spring-ease) backwards;
    }

    .hero-icon {
      position: relative;

      display: flex;

      animation: vip-hero-pop 600ms var(--transition-spring-ease) backwards;

      :global(svg) {
        width: var(--ni-48);
        height: var(--ni-48);
      }
    }
  }

  @keyframes vip-hero-rise {
    from {
      opacity: 0;
      transform: translateY(var(--ni-14));
    }
  }

  @keyframes vip-hero-pop {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }

  @keyframes vip-hero-breath {
    0%,
    100% {
      opacity: 0.7;
      transform: scale(0.9);
    }

    50% {
      opacity: 1;
      transform: scale(1.08);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-header-content[data-variant="hero"] {
      .trakt-vip-header-title,
      .trakt-vip-description > :global(*) {
        animation: none;
      }
    }

    .trakt-vip-hero-stage {
      .hero-aura,
      .hero-orbit,
      .hero-icon {
        animation: none;
      }
    }
  }
</style>
