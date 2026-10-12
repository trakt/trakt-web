<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    height = "clamp(var(--ni-120), 24vw, var(--ni-240))",
  }: { children: Snippet; height?: string } = $props();
</script>

<div class="trakt-splash-scene" style="--scene-height: {height}" aria-hidden="true">
  {@render children()}
</div>

<style>
  .trakt-splash-scene {
    position: absolute;
    bottom: 0;
    inset-inline: 0;

    height: var(--scene-height);

    animation: scene-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
  }

  @keyframes scene-rise {
    from {
      transform: translateY(30%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-splash-scene {
      animation: none;
    }
  }
</style>
