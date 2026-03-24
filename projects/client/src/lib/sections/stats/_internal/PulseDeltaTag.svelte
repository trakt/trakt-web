<script lang="ts">
  // Not using TrendTag here — it requires TagIntl dependency injection and
  // includes a TrendIcon arrow, neither of which fit the pulse card context.
  // Also, TrendTag has a latent bug (--color-text-stem-tag vs --color-foreground-stem-tag).
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    delta = null,
    note,
  }: {
    delta?: number | null;
    note?: string;
  } = $props();

  const direction = $derived.by(() => {
    if (note) return "neutral";
    if (delta == null) return null;
    if (delta > 0) return "up";
    if (delta < 0) return "down";
    return "neutral";
  });

  const text = $derived.by(() => {
    if (note) return note;
    if (delta == null) return null;
    if (delta > 0) return m.text_stats_delta_up({ count: String(delta) });
    if (delta < 0) return m.text_stats_delta_down({ count: String(Math.abs(delta)) });
    return m.text_stats_delta_same();
  });
</script>

{#if text && direction}
  <div class="trakt-pulse-delta-tag">
    <StemTag
      {text}
      --color-background-stem-tag="var(--color-background-trend-{direction}-background-tag)"
      --color-foreground-stem-tag="var(--color-text-trend-tag)"
    />
  </div>
{/if}

<style>
  .trakt-pulse-delta-tag {
    align-self: flex-start;
  }
</style>
