<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { toStoryProgress } from "./toStoryProgress.ts";

  const { progress, duration }: {
    progress: ReturnType<typeof toStoryProgress>;
    duration: string;
  } = $props();
</script>

<div class="trakt-recap-story-progress">
  <div class="progress-summary">
    <span class="bold">
      {m.text_recap_story_progress({
        count: progress.coveredCount,
        total: progress.totalCount,
      })}
    </span>
    <span class="small secondary">
      {m.text_recap_story_stats({
        episodes: progress.episodeCount,
        duration,
      })}
    </span>
  </div>

  <div
    class="progress-steps"
    style="--step-count: {progress.steps.length}"
    aria-hidden="true"
  >
    {#each progress.steps as step (step.season)}
      <span class="progress-step" data-state={step.state}></span>
    {/each}
  </div>

  {#if progress.nextSeason != null}
    <span class="small secondary">
      {m.text_recap_story_not_covered({ number: progress.nextSeason })}
    </span>
  {/if}
</div>

<style lang="scss">
  .trakt-recap-story-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-m);

    border-radius: var(--border-radius-l);
    background: var(--recap-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--recap-card-ring);

    .progress-summary {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .progress-steps {
      display: grid;
      grid-template-columns: repeat(var(--step-count), minmax(0, 1fr));
      gap: var(--gap-xxs);
    }

    .progress-step {
      height: var(--ni-8);
      border-radius: var(--ni-3);
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 12%,
        transparent
      );

      &[data-state="covered"] {
        background-color: var(--color-vip-border-accent);
      }

      &[data-state="next"] {
        background: repeating-linear-gradient(
          90deg,
          var(--color-text-secondary) 0 var(--ni-4),
          transparent var(--ni-4) var(--ni-8)
        );
      }
    }
  }
</style>
