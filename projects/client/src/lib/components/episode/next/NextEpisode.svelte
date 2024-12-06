<script lang="ts">
  import MarkAsWatchedActionButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedActionButton.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
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
    minutesLeft: number;
    onMarkAsWatched: () => void;
    type: EpisodeType;
    isLoading: boolean;
    showHref?: string;
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
    minutesLeft,
    onMarkAsWatched,
    type,
    isLoading,
    showHref,
  }: EpisodeProps = $props();
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
          {i18n.remainingText(remaining)} / {i18n.durationText(minutesLeft)}
        </span>
      </ShowProgressTag>
    {/snippet}
  </EpisodeCover>
  <CardFooter>
    <Link href={showHref}>
      <p class="episode-show-title ellipsis">{showTitle}</p>
    </Link>
    <p class="episode-title small ellipsis">
      {seasonNumber}x{episodeNumber} - {episodeTitle}
    </p>
    {#snippet actions()}
      <MarkAsWatchedActionButton
        title={episodeTitle}
        isWatched={false}
        isMarkingAsWatched={isLoading}
        onWatch={onMarkAsWatched}
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
