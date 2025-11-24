<script lang="ts">
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const { delta, i18n }: { delta: number; i18n: TagIntl } = $props();

  const trendDirection = $derived.by(() => {
    if (delta === 0) {
      return "neutral";
    }

    return delta > 0 ? "up" : "down";
  });
</script>

<StemTag
  --color-background-stem-tag="var(--color-background-trend-{trendDirection}-background-tag)"
  --color-text-stem-tag="var(--color-text-trend-tag)"
>
  <div class="trend-tag-container">
    {#if trendDirection !== "neutral"}
      <TrendIcon direction={trendDirection} />
    {/if}
    <p class="bold">
      {i18n.trendLabel(delta)}
    </p>
  </div>
</StemTag>

<style>
  .trend-tag-container {
    display: flex;
    align-items: center;

    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }
</style>
