<script lang="ts">
  import type { Snippet } from "svelte";
  import Skeleton from "../skeleton/Skeleton.svelte";

  const {
    children,
    icon,
    isLoading,
    tag,
    variant = "default",
  }: ChildrenProps & {
    icon: Snippet;
    isLoading: boolean;
    tag?: Snippet;
    variant?: "default" | "plain";
  } = $props();
</script>

<div class="trakt-stat" data-variant={variant}>
  {@render icon()}

  <div class="stat-value">
    {#if isLoading}
      <Skeleton width="var(--ni-40)" height="1lh" />
    {:else}
      <p class="ellipsis bold">
        {@render children()}
      </p>
    {/if}

    {@render tag?.()}
  </div>
</div>

<style>
  .trakt-stat {
    width: fit-content;

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    background: var(--shade-940);

    border-radius: var(--border-radius-s);
    padding: var(--ni-8) var(--ni-10);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &[data-variant="plain"] {
      background: transparent;
      padding: 0;
    }
  }
</style>
