<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  const {
    value,
    text,
    isLoading,
  }: { value: number; text: string; isLoading: boolean } = $props();
</script>

<div class="trakt-media-stat">
  <span class="bold">
    {#if isLoading}
      <LoadingIndicator />
    {:else}
      {toHumanNumber(value, languageTag())}
    {/if}
  </span>
  <span class="secondary">{text}</span>
</div>

<style>
  .trakt-media-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
