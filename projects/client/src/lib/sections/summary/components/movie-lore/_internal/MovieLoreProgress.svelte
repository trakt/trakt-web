<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MovieLoreBadge from "./MovieLoreBadge.svelte";
  import MovieLoreWatchlistAll from "./MovieLoreWatchlistAll.svelte";
  import { toLoreSignedOutLabel } from "./toLoreSignedOutLabel.ts";
  import type { toLoreProgress } from "./toLoreProgress.ts";

  const { progress, title, isLoading = false }: {
    progress: ReturnType<typeof toLoreProgress>;
    title: string;
    isLoading?: boolean;
  } = $props();

  const { mustWatch, optional, unseenMustWatch } = $derived(progress);

  const hasMustWatch = $derived(mustWatch.totalCount > 0);
  const isCaughtUp = $derived(hasMustWatch && unseenMustWatch.length === 0);

  const heading = $derived(
    hasMustWatch
      ? m.text_movie_lore_progress_must_watch({
        count: mustWatch.seenCount,
        total: mustWatch.totalCount,
      })
      : m.text_movie_lore_progress_no_must_watch(),
  );

  const counts = $derived(
    [
      hasMustWatch
        ? m.text_movie_lore_progress_must_watch_count({
          count: mustWatch.seenCount,
          total: mustWatch.totalCount,
        })
        : null,
      optional.totalCount > 0
        ? m.text_movie_lore_progress_optional_count({
          count: optional.seenCount,
          total: optional.totalCount,
        })
        : null,
    ]
      .filter((count) => count !== null)
      .join(" · "),
  );
</script>

<div class="trakt-movie-lore-progress" aria-busy={isLoading}>
  <RenderFor audience="public">
    <span class="bold">
      {toLoreSignedOutLabel({
        mustWatchCount: mustWatch.totalCount,
        optionalCount: optional.totalCount,
      })}
    </span>
  </RenderFor>

  <RenderFor audience="authenticated">
    <div class="progress-summary">
      {#if isLoading}
        <Skeleton width="60%" height="var(--ni-16)" />
        <Skeleton
          width="var(--ni-96)"
          height="var(--ni-20)"
          radius="var(--border-radius-pill)"
        />
      {:else}
        <span class="bold">{heading}</span>
        {#if isCaughtUp}
          <MovieLoreBadge tone="caught_up">
            {m.text_movie_lore_caught_up()}
          </MovieLoreBadge>
        {:else if hasMustWatch}
          <MovieLoreBadge tone="to_go">
            {m.text_movie_lore_progress_to_go({
              count: unseenMustWatch.length,
            })}
          </MovieLoreBadge>
        {/if}
      {/if}
    </div>

    <div class="progress-bar" aria-hidden="true">
      {#each mustWatch.steps as step (step.id)}
        <span
          class="progress-step"
          data-group="must-watch"
          data-state={!isLoading && step.isSeen ? "seen" : "unseen"}
        ></span>
      {/each}
      {#if hasMustWatch && optional.totalCount > 0}
        <span class="progress-gap"></span>
      {/if}
      {#each optional.steps as step (step.id)}
        <span
          class="progress-step"
          data-group="optional"
          data-state={!isLoading && step.isSeen ? "seen" : "unseen"}
        ></span>
      {/each}
    </div>

    <div class="progress-legend small">
      {#if isLoading}
        <Skeleton width="40%" height="var(--ni-12)" />
      {:else}
        <span class="secondary">{counts}</span>
        {#if unseenMustWatch.length > 0}
          <MovieLoreWatchlistAll films={unseenMustWatch} />
        {/if}
      {/if}
    </div>

    {#if isCaughtUp && !isLoading}
      <span class="small secondary">
        {m.text_movie_lore_progress_ready({ title })}
      </span>
    {/if}
  </RenderFor>
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
      min-height: var(--ni-24);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xxs) var(--gap-xs);
    }

    .progress-bar {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
    }

    .progress-step {
      flex: 1 1 0;
      min-width: 0;
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 12%,
        transparent
      );

      &[data-group="must-watch"] {
        height: var(--ni-8);
        border-radius: var(--ni-3);

        &[data-state="seen"] {
          background-color: var(--color-vip-border-accent);
        }
      }

      &[data-group="optional"] {
        height: var(--ni-4);
        border-radius: var(--ni-2);
        background-color: color-mix(
          in srgb,
          var(--color-text-primary) 6%,
          transparent
        );

        &[data-state="seen"] {
          background-color: color-mix(
            in srgb,
            var(--color-vip-border-accent) 55%,
            transparent
          );
        }
      }
    }

    .progress-gap {
      flex: 0 0 var(--gap-xs);
    }

    .progress-legend {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);
      min-height: var(--ni-40);
    }
  }
</style>
