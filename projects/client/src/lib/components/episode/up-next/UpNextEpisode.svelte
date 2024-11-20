<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/MarkAsWatchedButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import type { EpisodeType } from "$lib/models/EpisodeType";
  import EpisodeCard from "../card/EpisodeCard.svelte";
  import EpisodeCover from "../card/EpisodeCover.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import ShowProgressTag from "../tags/ShowProgressTag.svelte";

  type EpisodeProps = {
    i18n: EpisodeIntl;
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
    type: EpisodeType;
    isLoading: boolean;
  };

  const {
    i18n,
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
    type,
    isLoading,
  }: EpisodeProps = $props();

  const duration = $derived(remaining * runtime);
</script>

<EpisodeCard>
  <EpisodeCover
    {i18n}
    {type}
    src={`${posterUrl}`}
    alt={`${showTitle} - ${episodeTitle}`}
    {isLoading}
  >
    {#snippet tags()}
      <ShowProgressTag {total} progress={completed}>
        <span class="show-progress-text">
          {i18n.remainingText(remaining)} / {i18n.durationText(duration)}
        </span>
      </ShowProgressTag>
    {/snippet}
  </EpisodeCover>
  <CardFooter>
    <p class="episode-show-title ellipsis">{showTitle}</p>
    <p class="episode-title small ellipsis">
      {seasonNumber}x{episodeNumber} - {episodeTitle}
    </p>
    {#snippet actions()}
      <MarkAsWatchedButton
        label={`Mark ${episodeTitle} as watched`}
        disabled={isLoading}
        onclick={onMarkAsWatched}
      />
    {/snippet}
  </CardFooter>
</EpisodeCard>

<style>
  .show-progress-text {
    position: relative;
  }

  .episode-show-title {
    color: var(--color-text-primary);
    margin: 0;

    font-weight: 600;
  }

  .episode-title {
    color: var(--color-text-secondary);
    margin: 0;

    font-weight: 500;
  }
</style>
