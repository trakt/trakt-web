<script lang="ts">
  import CircularProgressChart from "$lib/components/charts/CircularProgressChart.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { completed, total }: { completed: number; total: number } = $props();

  const percentage = $derived(total > 0 ? (completed / total) * 100 : 0);
</script>

<div class="trakt-next-steps-ring">
  <CircularProgressChart {percentage}>
    <span class="bold next-steps-ring-count">
      {m.text_next_steps_progress({ completed, total })}
    </span>
  </CircularProgressChart>
</div>

<style>
  .trakt-next-steps-ring {
    --circular-progress-size: var(--ni-48);
    --circular-progress-thickness: 3.6;
    --circular-progress-indicator: var(--color-streak-day);
    --circular-progress-track: var(--color-border);

    display: flex;
    flex-shrink: 0;
  }

  .next-steps-ring-count {
    font-size: var(--font-size-text-small);
  }
</style>
