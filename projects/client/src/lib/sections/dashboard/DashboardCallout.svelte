<script lang="ts">
  import { useNextSteps } from "$lib/features/next-steps/stores/useNextSteps.ts";
  import StreakCallout from "../stats/StreakCallout.svelte";
  import NextStepsCallout from "./_internal/NextStepsCallout.svelte";

  const { state: nextSteps } = useNextSteps();
</script>

{#if $nextSteps.status === "loading"}
  <div class="trakt-dashboard-callout-skeleton"></div>
{:else if $nextSteps.status === "visible"}
  <NextStepsCallout page={$nextSteps.page} />
{:else}
  <StreakCallout />
{/if}

<style>
  .trakt-dashboard-callout-skeleton {
    height: var(--ni-74);
    margin-inline: var(--layout-distance-side);

    background: var(--color-streak-surface);
    border-radius: var(--border-radius-l);
  }
</style>
