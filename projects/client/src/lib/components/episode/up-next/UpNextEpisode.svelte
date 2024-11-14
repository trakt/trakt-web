<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/date/toHumanDuration";
  import EpisodeCard from "../card/EpisodeCard.svelte";
  import EpisodeCover from "../card/EpisodeCover.svelte";
  import EpisodeFooter from "../card/EpisodeFooter.svelte";
  import ShowProgressTag from "../tags/ShowProgressTag.svelte";
  import MarkAsWatchedButton from "./MarkAsWatchedButton.svelte";

  type EpisodeProps = {
    posterUrl: string;
    showTitle: string;
    episodeTitle: string;
    episodeNumber: number;
    seasonNumber: number;
    total: number;
    completed: number;
    remaining: number;
    runtime: number;
    onMarkAsWatched: () => void;
  };

  const {
    posterUrl,
    showTitle,
    episodeTitle,
    episodeNumber,
    seasonNumber,
    total,
    completed,
    remaining,
    runtime,
    onMarkAsWatched,
  }: EpisodeProps = $props();
</script>

<EpisodeCard>
  <EpisodeCover src={`${posterUrl}`} alt={`${showTitle} - ${episodeTitle}`}>
    {#snippet tags()}
      <ShowProgressTag {total} progress={completed}>
        <span class="show-progress-text">
          {m.remaining_episodes({ count: remaining })} ({toHumanDuration({
            minutes: runtime * remaining,
          })})
        </span>
      </ShowProgressTag>
    {/snippet}
  </EpisodeCover>
  <EpisodeFooter>
    <p class="episode-show-title ellipsis">{showTitle}</p>
    <p class="episode-title ellipsis">
      {seasonNumber}x{episodeNumber} - {episodeTitle}
    </p>
    {#snippet actions()}
      <MarkAsWatchedButton
        label={`Mark ${episodeTitle} as watched`}
        onClick={onMarkAsWatched}
      />
    {/snippet}
  </EpisodeFooter>
</EpisodeCard>

<style>
  .show-progress-text {
    position: relative;
  }

  .episode-show-title {
    color: var(--color-text-primary);
    margin: 0;

    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .episode-title {
    color: var(--color-text-secondary);
    margin: 0;

    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
