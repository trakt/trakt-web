<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { Snippet } from "svelte";

  type MediaStatProps = {
    value: number;
    text: string;
    isLoading: boolean;
    icon: Snippet;
  };

  const { value, text, isLoading, icon }: MediaStatProps = $props();
</script>

<div class="trakt-media-stat">
  <div class="stat-icon">
    {@render icon()}
  </div>

  <span class="secondary">{text}</span>

  <span class="bold">
    {#if isLoading}
      <div class="stat-loading-indicator">
        <LoadingIndicator />
      </div>
    {:else}
      {toHumanNumber(value, languageTag())}
    {/if}
  </span>
</div>

<style>
  .trakt-media-stat {
    box-shadow: var(--shadow-base);

    background-color: var(--color-card-background);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-xxs);

    border-radius: var(--border-radius-m);

    padding: var(--ni-12);

    flex: 1;
  }

  .stat-loading-indicator {
    display: contents;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .stat-icon {
    display: flex;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
