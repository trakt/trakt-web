<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { WatchedProgressEpisode } from "$lib/requests/models/WatchedProgressEntry.ts";

  const {
    episode,
    seasonNumber,
  }: {
    episode: WatchedProgressEpisode;
    seasonNumber: number;
  } = $props();

  const label = $derived(
    `${seasonNumber}x${String(episode.number).padStart(2, "0")}`,
  );

  const tooltipContent = $derived(() => {
    if (!episode.completed) return `${label} — Not watched`;
    if (!episode.lastWatchedAt) return `${label} — Watched`;
    const date = episode.lastWatchedAt.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${label} · Last watched ${date}`;
  });
</script>

<Tooltip content={tooltipContent()} variant="compact">
  <span
    class="episode-dot"
    class:is-watched={episode.completed}
    aria-label={label}
  ></span>
</Tooltip>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .episode-dot {
    display: block;
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    background-color: var(--shade-700);
    transition: background-color var(--transition-increment) ease-in;

    &.is-watched {
      background-color: var(--purple-500);
    }

    @include for-mouse {
      &:hover {
        background-color: var(--shade-500);

        &.is-watched {
          background-color: var(--purple-400);
        }
      }
    }
  }
</style>
