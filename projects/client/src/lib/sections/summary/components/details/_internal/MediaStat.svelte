<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  type MediaStatProps = {
    value: number;
    text: string;
    isLoading: boolean;
  };

  const { value, text, isLoading }: MediaStatProps = $props();
</script>

<div class="trakt-media-stat">
  <span class="stat-label">{text}</span>

  <span class="stat-value bold">
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
  /*
    A figure over its name, on its own dark panel. The panels do the
    separating - from the description above, the details below - so the
    stats row needs no hairline bands of its own.
  */
  .trakt-media-stat {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    flex: 1;

    padding: var(--ni-10) var(--ni-12);
    box-sizing: border-box;
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
  }

  .stat-label {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .stat-value {
    font-size: var(--ni-20);
  }

  .stat-loading-indicator {
    display: contents;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

</style>
