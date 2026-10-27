<script lang="ts">
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes.ts";
  import EpisodeWatchChip from "./EpisodeWatchChip.svelte";
  import SeasonWatchAction from "./SeasonWatchAction.svelte";

  const {
    showSlug,
    show,
    season,
    seasonLabel,
    upNextEpisodeId,
    watchedEpisodeIds,
    episodeCount,
    remainingCount,
  }: {
    showSlug: string;
    show: { id: number; title: string };
    season: number;
    seasonLabel: string;
    upNextEpisodeId: number | Nil;
    watchedEpisodeIds: ReadonlySet<number>;
    episodeCount: number;
    remainingCount: number;
  } = $props();

  const { list: episodes, isLoading } = $derived(
    useSeasonEpisodes(showSlug, season),
  );

  const isPlaceholder = $derived($isLoading !== false);

  const remainingEpisodes = $derived(
    $episodes.filter(
      (episode) =>
        episode.effectiveReleaseDate <= new Date() &&
        !watchedEpisodeIds.has(episode.id),
    ),
  );
</script>

<div class="trakt-season-episodes">
  {#if isPlaceholder}
    <ul class="episode-chips" aria-busy="true">
      {#each { length: episodeCount }, index (index)}
        <li>
          <span class="chip-skeleton">
            <span class="skeleton-circle"></span>
            <span class="skeleton-number"></span>
          </span>
        </li>
      {/each}
    </ul>

    {#if remainingCount > 0}
      <div class="season-action">
        <span class="skeleton-action"></span>
      </div>
    {/if}
  {:else}
    <ul class="episode-chips">
      {#each $episodes as episode (episode.id)}
        <li>
          <EpisodeWatchChip
            {episode}
            {show}
            isUpNext={episode.id === upNextEpisodeId}
          />
        </li>
      {/each}
    </ul>

    {#if remainingEpisodes.length > 0}
      <div class="season-action">
        <SeasonWatchAction {seasonLabel} episodes={remainingEpisodes} {show} />
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .trakt-season-episodes {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    padding: var(--gap-m) var(--ni-4) var(--ni-4);
  }

  .chip-skeleton {
    min-height: var(--ni-44);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-4);

    animation: skeleton-pulse calc(8 * var(--transition-increment)) ease-in-out
      infinite alternate;
  }

  .skeleton-circle,
  .skeleton-number,
  .skeleton-action {
    display: block;
    background-color: var(--color-watch-state-track);
  }

  .skeleton-circle {
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: 50%;
  }

  .skeleton-number {
    width: var(--ni-10);
    height: var(--ni-12);
    border-radius: var(--border-radius-xs);
  }

  .skeleton-action {
    width: var(--ni-96);
    height: var(--ni-32);
    border-radius: var(--border-radius-pill);
  }

  @keyframes skeleton-pulse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .chip-skeleton {
      animation: none;
    }
  }

  .episode-chips {
    all: unset;

    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    row-gap: var(--gap-xs);

    li {
      display: contents;
    }
  }

  .season-action {
    display: flex;
    justify-content: flex-end;
  }
</style>
