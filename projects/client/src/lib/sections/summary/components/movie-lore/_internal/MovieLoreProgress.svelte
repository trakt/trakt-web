<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieLoreVerdict } from "$lib/requests/models/MovieLoreVerdict.ts";
  import type { toLoreProgress } from "./toLoreProgress.ts";
  import { toLoreMovieTitle } from "./toLoreMovieTitle.ts";
  import { toLoreVerdictLabel } from "./toLoreVerdictLabel.ts";

  const { progress, verdict, title }: {
    progress: ReturnType<typeof toLoreProgress>;
    verdict: MovieLoreVerdict | undefined;
    title: string;
  } = $props();

  const summary = $derived(
    progress.totalCount === 1
      ? m.text_movie_lore_progress_one({
        count: progress.watchedCount,
        total: progress.totalCount,
      })
      : m.text_movie_lore_progress_other({
        count: progress.watchedCount,
        total: progress.totalCount,
      }),
  );
</script>

<div class="trakt-movie-lore-progress">
  <div class="progress-summary">
    <span class="bold">{summary}</span>
    {#if verdict}
      <span class="progress-verdict small bold" data-verdict={verdict}>
        {toLoreVerdictLabel(verdict)}
      </span>
    {/if}
  </div>

  <div
    class="progress-steps"
    style="--step-count: {progress.steps.length}"
    aria-hidden="true"
  >
    {#each progress.steps as step (step.id)}
      <span class="progress-step" data-state={step.state}></span>
    {/each}
  </div>

  <span class="small secondary">
    {#if progress.next}
      {m.text_movie_lore_progress_next({
        title: toLoreMovieTitle(progress.next),
      })}
    {:else}
      {m.text_movie_lore_progress_ready({ title })}
    {/if}
  </span>
</div>

<style lang="scss">
  .trakt-movie-lore-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-m);

    border-radius: var(--border-radius-l);
    background: var(--recap-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--recap-card-ring);

    .progress-summary {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xxs) var(--gap-xs);
    }

    .progress-verdict {
      padding: var(--ni-2) var(--ni-10);

      border-radius: var(--border-radius-pill);

      &[data-verdict="required"] {
        background: var(--color-reality-altered-background);
        color: var(--color-reality-altered-text);
      }

      &[data-verdict="helpful"] {
        background: var(--color-reality-adjusted-background);
        color: var(--color-reality-adjusted-text);
      }

      &[data-verdict="not_needed"] {
        background: var(--color-reality-accurate-background);
        color: var(--color-reality-accurate-text);
      }
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
