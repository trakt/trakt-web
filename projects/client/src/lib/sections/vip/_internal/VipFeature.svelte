<script lang="ts">
  import { revealOnView } from "$lib/utils/actions/revealOnView";
  import type { Snippet } from "svelte";
  import FeatureIcon from "./FeatureIcon.svelte";

  const {
    icon,
    description,
    title,
    delay = 0,
  }: {
    icon: Snippet;
    description: string;
    title: string;
    delay?: number;
  } = $props();
</script>

<div class="trakt-vip-feature" use:revealOnView={{ delay }}>
  <FeatureIcon>{@render icon()}</FeatureIcon>
  <h2 class="trakt-vip-feature-title">{title}</h2>
  <p class="trakt-vip-feature-description secondary">{description}</p>
</div>

<style>
  .trakt-vip-feature {
    box-sizing: border-box;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: var(--ni-38) auto;
    row-gap: var(--gap-xxs);
    column-gap: var(--gap-s);
    align-items: start;

    padding: var(--ni-16);

    background: var(--color-card-background);
    border-radius: var(--border-radius-xxl);
    box-shadow: var(--shadow-base);
  }

  .trakt-vip-feature-title {
    align-self: center;
  }

  .trakt-vip-feature-description {
    grid-column: 2;
  }

  @media (prefers-reduced-motion: no-preference) {
    .trakt-vip-feature:not([data-reveal="pending"])
      :global(.trakt-vip-feature-icon::after) {
      animation: vip-feature-sheen 900ms ease-out 400ms both;
    }
  }

  @keyframes vip-feature-sheen {
    from {
      transform: translateX(-120%);
    }

    to {
      transform: translateX(120%);
    }
  }
</style>
