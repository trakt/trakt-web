<script lang="ts">
  import type { Snippet } from "svelte";
  import LoadingIndicator from "../icons/LoadingIndicator.svelte";

  const {
    children,
    icon,
    isLoading,
  }: ChildrenProps & { icon: Snippet; isLoading: boolean } = $props();
</script>

<div class="trakt-stat">
  {#if isLoading}
    <LoadingIndicator />
  {:else}
    {@render icon()}
  {/if}

  <p class="ellipsis bold">
    {@render children()}
  </p>
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
  }
</style>
